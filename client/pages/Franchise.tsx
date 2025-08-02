import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "@/components/layout/AppLayout";
import { URLS } from '@/config/urls';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Franchise() {
  const [intro, setIntro] = useState("");
  const [eligibility, setEligibility] = useState<string[]>([""]);
  const [howToApply, setHowToApply] = useState("");
  const [models, setModels] = useState([{ name: "", description: "", type: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing data
  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        const res = await axios.get(URLS.API.FRANCHISE.LIST);
        const data = res.data.franchise;

        setIntro(data.intro || "");
        setEligibility(data.eligibility?.length ? data.eligibility : [""]);
        setHowToApply(data.howToApply || "");
        setModels(
          Array.isArray(data.models) && data.models.length > 0
            ? data.models
            : [{ name: "", type: "", description: "" }]
        );
      } catch (err) {
        console.error("Fetch failed:", err);
        toast.warning("No existing franchise content or failed to fetch.");
      }
    };

    fetchFranchise();
  }, []);

  const handleEligibilityChange = (value: string, index: number) => {
    const updated = [...eligibility];
    updated[index] = value;
    setEligibility(updated);
  };

  const addEligibility = () => setEligibility([...eligibility, ""]);
  const removeEligibility = (index: number) =>
    setEligibility(eligibility.filter((_, i) => i !== index));

  const handleModelChange = (index: number, field: string, value: string) => {
    const updated = [...models];
    updated[index][field] = value;
    setModels(updated);
  };

  const addModel = () => setModels([...models, { name: "", description: "", type: "" }]);
  const removeModel = (index: number) => setModels(models.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    setError("");
    if (!intro || !howToApply || models.length === 0 || eligibility.length === 0) {
      setError("Please fill out all required fields.");
      return;
    }

    const payload = { intro, eligibility, howToApply, models };
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(URLS.API.FRANCHISE.LIST, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Franchise info saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save franchise info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <h1 className="text-3xl font-bold">Franchise Content Management</h1>

        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Introduction */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Introduction</h2>
          <Textarea
            placeholder="Write a short intro about your franchise opportunity..."
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
          />
        </section>

        {/* Eligibility */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Eligibility Criteria</h2>
          {eligibility.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Eligibility point ${index + 1}`}
                value={item}
                onChange={(e) => handleEligibilityChange(e.target.value, index)}
              />
              <Button variant="destructive" onClick={() => removeEligibility(index)}>
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addEligibility}>
            <Plus size={16} className="mr-1" /> Add Point
          </Button>
        </section>

        {/* How to Apply */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">How to Apply</h2>
          <Textarea
            placeholder="Explain how to apply for the franchise..."
            value={howToApply}
            onChange={(e) => setHowToApply(e.target.value)}
          />
        </section>

        {/* Franchise Models */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Franchise Models</h2>
          {Array.isArray(models) &&
            models.map((model, index) => (
              <div key={index} className="border p-4 rounded space-y-2">
                <Input
                  placeholder="Model Name (e.g., Gold Member)"
                  value={model.name}
                  onChange={(e) => handleModelChange(index, "name", e.target.value)}
                />
                <Input
                  placeholder="Type (e.g., Exclusive, Shared, Referral)"
                  value={model.type}
                  onChange={(e) => handleModelChange(index, "type", e.target.value)}
                />
                <Textarea
                  placeholder="Model Description"
                  value={model.description}
                  onChange={(e) => handleModelChange(index, "description", e.target.value)}
                />
                <Button variant="destructive" onClick={() => removeModel(index)}>
                  Remove Model
                </Button>
              </div>
            ))}
          <Button variant="outline" onClick={addModel}>
            <Plus size={16} className="mr-1" /> Add Model
          </Button>
        </section>

        <Button onClick={handleSubmit} className="mt-6" disabled={loading}>
          {loading ? "Saving..." : "Save Franchise Info"}
        </Button>
      </div>
    </AppLayout>
  );
}
