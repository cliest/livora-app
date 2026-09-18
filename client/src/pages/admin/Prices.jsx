import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Seo from '../../components/Seo.jsx';
import { TextField, SelectField, TextAreaField } from '../../components/ui/FormField.jsx';
import { priceCategorySchema, priceItemSchema, PRICE_ICON_OPTIONS } from '../../lib/formSchemas.js';
import { api, ApiError } from '../../lib/api.js';
import { PRICE_ICON_MAP } from '../../lib/priceIcons.js';

const EMPTY_CATEGORY = { title: '', icon: 'SHIELD', note: '' };
const EMPTY_ITEM = { name: '', price: '', isPopular: false, isEmergency: false };

function CategoryForm({ initial, onCancel, onSubmit, submitting, error }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(priceCategorySchema), defaultValues: initial });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-sand rounded-xl p-s3 flex flex-col gap-s2 mb-s3">
      <TextField label="Category title" name="title" register={register} error={errors.title} required />
      <SelectField label="Icon" name="icon" register={register} error={errors.icon} options={PRICE_ICON_OPTIONS} required />
      <TextAreaField label="Note (optional)" name="note" register={register} error={errors.note} />
      {error && <p className="text-[0.82rem] font-semibold text-coral-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="btn btn--primary btn--sm disabled:opacity-60">
          Save category
        </button>
        <button type="button" onClick={onCancel} className="btn btn--outline btn--sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

function ItemForm({ initial, onCancel, onSubmit, submitting, error }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(priceItemSchema), defaultValues: initial });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-sand rounded-lg p-3 flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Treatment" name="name" register={register} error={errors.name} required />
        <TextField label="Price" name="price" register={register} error={errors.price} required placeholder="from K350" />
      </div>
      <div className="flex flex-wrap gap-s3">
        <label className="flex items-center gap-2 text-[0.84rem] font-medium text-ink">
          <input type="checkbox" {...register('isPopular')} className="w-4 h-4 accent-cyan" />
          Popular (shows on homepage)
        </label>
        <label className="flex items-center gap-2 text-[0.84rem] font-medium text-ink">
          <input type="checkbox" {...register('isEmergency')} className="w-4 h-4 accent-cyan" />
          Emergency (shows on Emergency page)
        </label>
      </div>
      {error && <p className="text-[0.82rem] font-semibold text-coral-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="btn btn--primary btn--sm disabled:opacity-60">
          Save item
        </button>
        <button type="button" onClick={onCancel} className="btn btn--outline btn--sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminPrices() {
  const queryClient = useQueryClient();
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [addingItemFor, setAddingItemFor] = useState(null); // categoryId
  const [editingItemId, setEditingItemId] = useState(null);
  const [error, setError] = useState('');

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['prices'],
    queryFn: async () => (await api.getPrices()).categories,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['prices'] });

  const createCategory = useMutation({ mutationFn: api.createPriceCategory, onSuccess: invalidate });
  const updateCategory = useMutation({ mutationFn: ({ id, payload }) => api.updatePriceCategory(id, payload), onSuccess: invalidate });
  const deleteCategory = useMutation({ mutationFn: api.deletePriceCategory, onSuccess: invalidate });
  const createItem = useMutation({ mutationFn: api.createPriceItem, onSuccess: invalidate });
  const updateItem = useMutation({ mutationFn: ({ id, payload }) => api.updatePriceItem(id, payload), onSuccess: invalidate });
  const deleteItem = useMutation({ mutationFn: api.deletePriceItem, onSuccess: invalidate });

  const handleDeleteCategory = (id) => {
    if (confirm('Delete this category and all its prices?')) deleteCategory.mutate(id);
  };
  const handleDeleteItem = (id) => {
    if (confirm('Delete this price item?')) deleteItem.mutate(id);
  };

  return (
    <div>
      <Seo title="Prices | Livora Admin" description="Manage the treatment price list." path="/admin/prices" noindex />
      <div className="flex items-center justify-between mb-s3">
        <h1 className="text-[1.6rem]">Prices</h1>
        {!addingCategory && (
          <button type="button" onClick={() => setAddingCategory(true)} className="btn btn--primary btn--sm">
            + Add category
          </button>
        )}
      </div>

      {addingCategory && (
        <CategoryForm
          initial={EMPTY_CATEGORY}
          submitting={createCategory.isPending}
          error={error}
          onCancel={() => {
            setAddingCategory(false);
            setError('');
          }}
          onSubmit={async (data) => {
            setError('');
            try {
              await createCategory.mutateAsync(data);
              setAddingCategory(false);
            } catch (err) {
              setError(err instanceof ApiError ? err.message : 'Something went wrong.');
            }
          }}
        />
      )}

      {isLoading && <p className="text-muted">Loading…</p>}

      <div className="flex flex-col gap-s3">
        {categories.map((cat) => {
          const Icon = PRICE_ICON_MAP[cat.icon];
          return (
            <div key={cat.id} className="bg-white border border-line rounded-[18px] p-s4">
              {editingCategoryId === cat.id ? (
                <CategoryForm
                  initial={{ title: cat.title, icon: cat.icon, note: cat.note || '' }}
                  submitting={updateCategory.isPending}
                  error={error}
                  onCancel={() => {
                    setEditingCategoryId(null);
                    setError('');
                  }}
                  onSubmit={async (data) => {
                    setError('');
                    try {
                      await updateCategory.mutateAsync({ id: cat.id, payload: data });
                      setEditingCategoryId(null);
                    } catch (err) {
                      setError(err instanceof ApiError ? err.message : 'Something went wrong.');
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-between mb-s3">
                  <h3 className="flex items-center gap-2 mb-0">
                    <Icon className="w-[20px] h-[20px] text-cyan flex-none" />
                    {cat.title}
                  </h3>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setEditingCategoryId(cat.id)} className="btn btn--outline btn--sm">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDeleteCategory(cat.id)} className="btn btn--outline btn--sm text-coral-600">
                      Delete
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {cat.items.map((item) =>
                  editingItemId === item.id ? (
                    <ItemForm
                      key={item.id}
                      initial={{ name: item.name, price: item.price, isPopular: item.isPopular, isEmergency: item.isEmergency }}
                      submitting={updateItem.isPending}
                      error={error}
                      onCancel={() => {
                        setEditingItemId(null);
                        setError('');
                      }}
                      onSubmit={async (data) => {
                        setError('');
                        try {
                          await updateItem.mutateAsync({ id: item.id, payload: data });
                          setEditingItemId(null);
                        } catch (err) {
                          setError(err instanceof ApiError ? err.message : 'Something went wrong.');
                        }
                      }}
                    />
                  ) : (
                    <div key={item.id} className="flex items-center gap-3 py-[9px] border-b border-dashed border-line last:border-0">
                      <div className="flex-1 min-w-0">
                        <span className="text-[0.92rem] font-semibold text-ink">{item.name}</span>
                        {(item.isPopular || item.isEmergency) && (
                          <span className="ml-2 text-[0.7rem] font-bold uppercase text-cyan-700">
                            {[item.isPopular && 'Popular', item.isEmergency && 'Emergency'].filter(Boolean).join(' · ')}
                          </span>
                        )}
                      </div>
                      <span className="text-[0.92rem] font-extrabold text-cyan-700 whitespace-nowrap">{item.price}</span>
                      <button type="button" onClick={() => setEditingItemId(item.id)} className="text-[0.8rem] font-semibold text-cyan-700 hover:underline">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDeleteItem(item.id)} className="text-[0.8rem] font-semibold text-coral-600 hover:underline">
                        Delete
                      </button>
                    </div>
                  )
                )}
              </div>

              {addingItemFor === cat.id ? (
                <div className="mt-s3">
                  <ItemForm
                    initial={EMPTY_ITEM}
                    submitting={createItem.isPending}
                    error={error}
                    onCancel={() => {
                      setAddingItemFor(null);
                      setError('');
                    }}
                    onSubmit={async (data) => {
                      setError('');
                      try {
                        await createItem.mutateAsync({ ...data, categoryId: cat.id });
                        setAddingItemFor(null);
                      } catch (err) {
                        setError(err instanceof ApiError ? err.message : 'Something went wrong.');
                      }
                    }}
                  />
                </div>
              ) : (
                <button type="button" onClick={() => setAddingItemFor(cat.id)} className="mt-s3 text-[0.85rem] font-semibold text-cyan-700 hover:underline">
                  + Add price item
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
