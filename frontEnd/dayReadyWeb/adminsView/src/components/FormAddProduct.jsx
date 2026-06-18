import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import Button from "./Button";

export default function FormAddProduct({ onSubmit, onCancel, initialProduct = null, submitting = false }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: initialProduct?.name || "",
            description: initialProduct?.description || "",
            category: initialProduct?.category    || "",
            serviceType: initialProduct?.serviceType || "Presencial",
            price: initialProduct?.price       || "",
            stock: initialProduct?.stock       || "",
        },
    });

    const [imagePreview, setImagePreview] = useState(initialProduct?.image || null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (initialProduct?.image) setImagePreview(initialProduct.image);
    }, [initialProduct]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const categories = [
        { value: "", label: "Seleccionar categoría" },
        { value: "combos", label: "Combos" },
        { value: "saludable", label: "Saludable"    },
        { value: "comida rápida",label: "Comida Rápida"},
        { value: "bebida", label: "Bebida" },
        { value: "sopa", label: "Sopa"  },
    ];

    const serviceTypes = [
        { value: "Presencial", label: "Presencial" },
        { value: "Delivery", label: "Delivery"   },
        { value: "Ambos", label: "Ambos"      },
    ];

    const fieldClass = (hasError) =>
        `w-full px-3 py-2 text-sm rounded-lg border-2 focus:outline-none focus:ring-2 transition ${
            hasError
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-orange-400 focus:ring-orange-200"
        }`;

    return (
        <form onSubmit={handleSubmit((data) => onSubmit({ ...data, image: imageFile }))}
              className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Imagen */}
            <div>
                <label className="block text-gray-900 font-bold mb-4">Imagen del Producto</label>
                <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
                     className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-all cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageChange}
                           className="hidden" id="image-input" />
                    {imagePreview ? (
                        <div className="space-y-3">
                            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                            <label htmlFor="image-input" className="text-orange-500 text-sm cursor-pointer font-medium">
                                Cambiar imagen
                            </label>
                        </div>
                    ) : (
                        <label htmlFor="image-input" className="cursor-pointer">
                            <Upload className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium mb-1">Arrastra una imagen o haz clic</p>
                            <p className="text-gray-400 text-xs">JPG, PNG o WEBP (Máx. 5MB)</p>
                        </label>
                    )}
                </div>
            </div>

            {/* Campos */}
            <div className="space-y-4">
                {/* Nombre */}
                <div>
                    <label className="block text-gray-700 text-xs font-semibold mb-1">Nombre del Producto</label>
                    <input placeholder="Ej. Hamburguesa Clásica"
                           {...register("name", { required: "El nombre es requerido", minLength: { value: 2, message: "Nombre muy corto" } })}
                           className={fieldClass(errors.name)} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-gray-700 text-xs font-semibold mb-1">Descripción</label>
                    <textarea placeholder="Describe los ingredientes, extras..."
                              {...register("description", { required: "La descripción es requerida" })}
                              className={`${fieldClass(errors.description)} resize-none h-20`} />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                {/* Categoría y Tipo */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-xs font-semibold mb-1">Categoría</label>
                        <select {...register("category", { required: "Selecciona una categoría" })}
                                className={fieldClass(errors.category)}>
                            {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-xs font-semibold mb-1">Tipo de Servicio</label>
                        <select {...register("serviceType")} className={fieldClass(false)}>
                            {serviceTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Precio y Stock */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-xs font-semibold mb-1">Precio</label>
                        <div className="relative">
                            <input type="number" step="0.01" placeholder="0.00"
                                   {...register("price", { required: "El precio es requerido", min: { value: 0.01, message: "Debe ser mayor a 0" } })}
                                   className={`${fieldClass(errors.price)} pr-12`} />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">USD</span>
                        </div>
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-xs font-semibold mb-1">Stock / Cantidad</label>
                        <input type="number" placeholder="20"
                               {...register("stock", { required: "El stock es requerido", min: { value: 0, message: "No puede ser negativo" } })}
                               className={fieldClass(errors.stock)} />
                        {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                    </div>
                </div>
            </div>

            {/* Botones */}
            <div className="md:col-span-2 flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button type="button" onClick={onCancel} disabled={submitting}
                        className="px-6 py-3 rounded-lg font-semibold text-orange-400 hover:bg-orange-50 transition border border-orange-400 disabled:opacity-50">
                    Cancelar
                </button>
                <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? "Guardando..." : initialProduct ? "Actualizar Producto" : "Guardar Producto"}
                </Button>
            </div>
        </form>
    );
}
