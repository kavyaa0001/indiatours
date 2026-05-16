import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Package } from "@/data/packages";
import { usePackages } from "@/hooks/usePackages";
import { Plus, Trash2, Edit2, X, Check, Image as ImageIcon, IndianRupee, Clock, Type, AlignLeft, Database, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { migratePackages } from "@/data/migrate";

export default function ManagePackages() {
  const { packages, loading } = usePackages();
  const [isAdding, setIsAdding] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [uploading, setUploading] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAdding) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isAdding]);

  const initialForm: Package = {
    id: "",
    title: "",
    image: "",
    price: "",
    basePrice: 0,
    duration: "",
    description: "",
    highlights: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    terms: [
      "50% advance payment required for booking confirmation.",
      "Remaining 50% must be cleared 7 days prior to departure.",
      "Cancellations made 15 days prior to departure are eligible for a 50% refund.",
      "No refunds for cancellations within 15 days of departure."
    ]
  };

  const [form, setForm] = useState<Package>(initialForm);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) {
      alert("Please enter a unique Package ID");
      return;
    }
    try {
      const docId = form.id.toLowerCase().replace(/\s+/g, "-");
      const packageData = { ...form, id: docId };
      
      await setDoc(doc(db, "packages", docId), packageData);
      
      // Also initialize seats if not exists
      await setDoc(doc(db, "packageSeats", docId), {
        totalSeats: 20,
        bookedSeats: 0
      }, { merge: true });

      setIsAdding(false);
      setEditingPkg(null);
      setForm(initialForm);
      alert("Package saved successfully!");
    } catch (error) {
      console.error("Error saving package:", error);
      alert("Failed to save package.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `packages/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm({ ...form, image: url });
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Make sure Firebase Storage is enabled in your console.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      await deleteDoc(doc(db, "packages", id));
    }
  };

  const addHighlight = () => setForm({ ...form, highlights: [...form.highlights, ""] });
  const updateHighlight = (idx: number, val: string) => {
    const newH = [...form.highlights];
    newH[idx] = val;
    setForm({ ...form, highlights: newH });
  };

  const addItinerary = () => setForm({ 
    ...form, 
    itinerary: [...form.itinerary, { day: `Day ${form.itinerary.length + 1}`, title: "", description: "" }] 
  });
  const updateItinerary = (idx: number, field: string, val: string) => {
    const newI = [...form.itinerary];
    newI[idx] = { ...newI[idx], [field]: val };
    setForm({ ...form, itinerary: newI });
  };

  if (loading) return <div className="text-white/30 text-center py-20">Loading packages...</div>;

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 border border-white/5 bg-white/5">
        <Database className="w-16 h-16 text-white/10 mb-6" />
        <h3 className="text-2xl font-display mb-2">No Packages Found in Database</h3>
        <p className="text-white/40 mb-8 max-w-md text-center text-sm">
          It looks like your Firestore collection is empty. Click below to import all the default packages from your code.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={async () => { await migratePackages(); alert("Import complete!"); }}
            className="px-8 py-4 bg-lime-accent text-mist-black font-display text-sm uppercase tracking-widest hover:bg-white transition-colors"
          >
            Import Default Packages
          </button>
          <button 
            onClick={() => { setIsAdding(true); setForm(initialForm); }}
            className="px-8 py-4 border border-white/10 text-white font-display text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Create Manually
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-display uppercase tracking-tight">Packages <span className="text-white/20 text-xl">({packages.length})</span></h2>
        <button 
          onClick={() => { setIsAdding(true); setForm(initialForm); }}
          className="flex items-center gap-2 px-6 py-3 bg-lime-accent text-mist-black font-display text-sm uppercase tracking-widest hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Package
        </button>
      </div>

      {/* Grid of existing packages */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white/5 border border-white/10 overflow-hidden flex flex-col">
            <div className="h-40 relative">
              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => { setEditingPkg(pkg); setForm(pkg); setIsAdding(true); }}
                  className="p-2 bg-white/10 backdrop-blur-md text-white hover:text-lime-accent transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 bg-white/10 backdrop-blur-md text-white hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-display text-white">{pkg.title}</h3>
                <span className="text-lime-accent font-display">{pkg.price}</span>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-4">{pkg.duration}</p>
              <p className="text-white/60 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
                {pkg.description}
              </p>
              <div className="flex gap-4 mt-auto">
                <span className="text-[10px] uppercase tracking-widest text-white/20 border border-white/10 px-2 py-1">
                  {pkg.itinerary.length} Days
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/20 border border-white/10 px-2 py-1">
                  {pkg.highlights.length} Highlights
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-mist-black/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-mist-black border border-white/10 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-display uppercase tracking-tight text-white">
                    {editingPkg ? "Edit Package" : "Add New Package"}
                  </h2>
                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
                    Fill in the details to publish a new travel experience
                  </p>
                </div>
                <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-8 h-8 font-light" />
                </button>
              </div>

              {/* Form Scrollable Content */}
              <form 
                onSubmit={handleSave} 
                data-lenis-prevent
                className="flex-1 overflow-y-auto p-8 space-y-12 selection:bg-lime-accent selection:text-mist-black scrollbar-thin scrollbar-thumb-lime-accent/20"
              >
                
                {/* Basic Info Section */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lime-accent font-editorial italic text-xl border-b border-lime-accent/20 pb-2">Basic Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs uppercase tracking-widest text-white/40 mb-2 block">Package ID (unique)</label>
                        <input 
                          type="text" 
                          value={form.id} 
                          onChange={(e) => setForm({ ...form, id: e.target.value })}
                          placeholder="e.g. kedarnath-special"
                          required
                          disabled={!!editingPkg}
                          className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-lime-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest text-white/40 mb-2 block">Display Title</label>
                        <input 
                          type="text" 
                          value={form.title} 
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="e.g. Kedarnath Spiritual Journey"
                          required
                          className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-lime-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest text-white/40 mb-2 block">Duration</label>
                        <input 
                          type="text" 
                          value={form.duration} 
                          onChange={(e) => setForm({ ...form, duration: e.target.value })}
                          placeholder="e.g. 6 Days / 5 Nights"
                          required
                          className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-lime-accent transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lime-accent font-editorial italic text-xl border-b border-lime-accent/20 pb-2">Pricing & Visuals</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs uppercase tracking-widest text-white/40 mb-2 block">Display Price (string)</label>
                          <input 
                            type="text" 
                            value={form.price} 
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            placeholder="₹18,500"
                            required
                            className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-lime-accent transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest text-white/40 mb-2 block">Base Price (number)</label>
                          <input 
                            type="number" 
                            value={form.basePrice} 
                            onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })}
                            placeholder="18500"
                            required
                            className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-lime-accent transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest text-white/40 mb-2 block">Image (URL or Upload)</label>
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            value={form.image} 
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                            placeholder="/images/your-image.jpg or URL"
                            required
                            className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-lime-accent transition-colors text-sm"
                          />
                          <div className="flex items-center gap-4">
                            <label className={`flex-1 flex items-center justify-center gap-2 border border-dashed border-white/20 py-4 cursor-pointer hover:bg-white/5 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                              {uploading ? <Loader2 className="w-4 h-4 animate-spin text-lime-accent" /> : <Upload className="w-4 h-4 text-white/40" />}
                              <span className="text-[10px] uppercase tracking-widest text-white/40">
                                {uploading ? "Uploading..." : "Upload from PC"}
                              </span>
                              <input 
                                type="file" 
                                onChange={handleImageUpload}
                                className="hidden" 
                                accept="image/*"
                              />
                            </label>
                            {form.image && (
                              <div className="w-16 h-16 border border-white/10 overflow-hidden">
                                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h3 className="text-lime-accent font-editorial italic text-xl border-b border-lime-accent/20 pb-2">Experience Description</h3>
                  <textarea 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the journey in detail..."
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-lime-accent transition-colors resize-none font-light leading-relaxed"
                  />
                </div>

                {/* Highlights */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lime-accent font-editorial italic text-xl border-b border-lime-accent/20 pb-2 flex-1">Highlights</h3>
                    <button type="button" onClick={addHighlight} className="text-lime-accent hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
                      <Plus className="w-4 h-4" /> Add Highlight
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {form.highlights.map((h, i) => (
                      <div key={i} className="flex gap-2">
                        <input 
                          type="text" 
                          value={h} 
                          onChange={(e) => updateHighlight(i, e.target.value)}
                          placeholder={`Highlight ${i + 1}`}
                          className="flex-1 bg-white/5 border border-white/10 p-3 text-sm text-white focus:border-lime-accent focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => setForm({ ...form, highlights: form.highlights.filter((_, idx) => idx !== i) })}
                          className="text-white/20 hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itinerary */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lime-accent font-editorial italic text-xl border-b border-lime-accent/20 pb-2 flex-1">Itinerary (Day-wise Plan)</h3>
                    <button type="button" onClick={addItinerary} className="text-lime-accent hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
                      <Plus className="w-4 h-4" /> Add Day
                    </button>
                  </div>
                  <div className="space-y-6">
                    {form.itinerary.map((it, i) => (
                      <div key={i} className="p-6 bg-white/5 border border-white/10 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs uppercase tracking-[0.3em] text-white/30">{it.day}</span>
                          <button 
                            type="button" 
                            onClick={() => setForm({ ...form, itinerary: form.itinerary.filter((_, idx) => idx !== i) })}
                            className="text-white/20 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input 
                          type="text" 
                          value={it.title} 
                          onChange={(e) => updateItinerary(i, "title", e.target.value)}
                          placeholder="Day Title (e.g. Arrival in Rishikesh)"
                          className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:border-lime-accent focus:outline-none font-display text-lg"
                        />
                        <textarea 
                          value={it.description} 
                          onChange={(e) => updateItinerary(i, "description", e.target.value)}
                          placeholder="What happens on this day?"
                          rows={2}
                          className="w-full bg-transparent p-2 text-sm text-white/60 focus:outline-none resize-none font-light leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Area */}
                <div className="pt-8 border-t border-white/10 flex justify-end gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="px-8 py-4 border border-white/10 text-white/40 font-display text-sm uppercase tracking-widest hover:text-white hover:border-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-12 py-4 bg-lime-accent text-mist-black font-display text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-lime-accent/10"
                  >
                    {editingPkg ? "Update Package" : "Publish Package"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
