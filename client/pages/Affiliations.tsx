import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "@/components/layout/AppLayout";
import { URLS } from '@/config/urls';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Affiliation {
  _id: string;
  name: string;
  logo: {
    filename: string;
    original_name: string;
  };
  category: string;
  description: string;
}

export default function Affiliations() {
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const fetchAffiliations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(URLS.API.AFFILIATIONS.LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAffiliations(res.data.data);
    } catch (err) {
      console.error("Error fetching affiliations:", err);
      setError("Unauthorized or failed to load affiliations.");
    }
  };

  useEffect(() => {
    fetchAffiliations();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.description) {
      setError("All fields are required.");
      return;
    }

    if (!logo && !editingId) {
      setError("Logo is required.");
      return;
    }

    const token = localStorage.getItem("token");
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("category", formData.category);
    fd.append("description", formData.description);
    if (logo) fd.append("logo", logo);

    try {
      setLoading(true);

      if (editingId) {
        await axios.put(URLS.API.AFFILIATIONS.UPDATE(editingId), fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Affiliation updated successfully");
      } else {
        await axios.post(URLS.API.AFFILIATIONS.LIST, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Affiliation created successfully");
      }

      setFormData({ name: "", category: "", description: "" });
      setLogo(null);
      setEditingId(null);
      await fetchAffiliations();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save affiliation");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(URLS.API.AFFILIATIONS.DELETE(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Affiliation deleted");
      await fetchAffiliations();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete affiliation");
    }
  };

  const filtered = affiliations.filter((aff) =>
    categoryFilter === "All" ? true : aff.category === categoryFilter
  );

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <h1 className="text-3xl font-bold">Affiliations</h1>

        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleCreateOrUpdate}
          className="space-y-4 border p-6 rounded-lg shadow bg-white"
        >
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Affiliation" : "Add New Affiliation"}
          </h2>

          <Input
            placeholder="Affiliation Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <Select
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, category: val }))
            }
            value={formData.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {["Educational", "Government", "NGO", "Private", "Other"].map(
                (cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          {logo && (
            <img
              src={URL.createObjectURL(logo)}
              alt="Preview"
              className="w-20 h-20 object-contain rounded border mb-2"
            />
          )}

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files?.[0] || null)}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : editingId ? "Update" : "Add Affiliation"}
          </Button>
        </form>

        {/* Filter */}
        <div className="flex items-center gap-4">
          <Select onValueChange={setCategoryFilter} value={categoryFilter}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Educational">Educational</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
              <SelectItem value="NGO">NGO</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cards */}
        {filtered.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Partner Logos & Names</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map((aff) => (
                <div
                  key={aff._id}
                  className="border rounded-lg p-4 shadow hover:shadow-md transition"
                >
                  <img
                    src={URLS.FILES.LOGO(aff.logo.filename)}
                    alt={aff.logo.original_name}
                    className="w-24 h-24 object-contain mb-4"
                  />
                  <h3 className="text-lg font-bold">{aff.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {aff.description}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 italic">
                    Category: {aff.category}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          name: aff.name,
                          category: aff.category,
                          description: aff.description,
                        });
                        setLogo(null);
                        setEditingId(aff._id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(aff._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
