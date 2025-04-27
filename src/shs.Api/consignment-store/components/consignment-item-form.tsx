"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash } from "lucide-react"
import { consignments, ConsignmentSupplierEntity, store } from "@/lib/api"
import { MultiSelect } from "@/components/ui/multi-select"

interface Brand {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Item {
  name: string;
  description: string;
  price: string;
  color: string;
  brandId: string;
  tags: string[];
  size: string;
  receiveDate: string;
}

interface ConsignmentItemFormProps {
  mode: 'create' | 'edit';
  initialValues?: {
    supplierId: string;
    items: Item[];
  };
  onSubmit: (data: {
    supplierId: number;
    consignmentDate: string;
    items: Array<{
      name: string;
      description?: string;
      price: number;
      color?: string;
      brandId?: number;
      tagIds?: number[];
      size: string;
    }>;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ConsignmentItemForm({ mode, initialValues, onSubmit, onCancel }: ConsignmentItemFormProps) {
  const [owners, setOwners] = useState<ConsignmentSupplierEntity[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ownerId, setOwnerId] = useState(initialValues?.supplierId || "")
  const [items, setItems] = useState<Item[]>(initialValues?.items || [{
    name: "",
    description: "",
    price: "",
    color: "",
    brandId: "",
    tags: [],
    size: "",
    receiveDate: new Date().toISOString().split('T')[0]
  }])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ownersResponse, brandsResponse, tagsResponse] = await Promise.all([
          consignments.getAllOwners(),
          store.getBrands(),
          store.getTags()
        ]);
        setOwners(ownersResponse);
        setBrands(brandsResponse);
        setTags(tagsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemChange = (index: number, field: keyof Item, value: string | string[]) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, {
      name: "",
      description: "",
      price: "",
      color: "",
      brandId: "",
      tags: [],
      size: "",
      receiveDate: new Date().toISOString().split('T')[0]
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit({
        supplierId: parseInt(ownerId),
        consignmentDate: new Date().toISOString(),
        items: items.map(item => ({
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          color: item.color,
          brandId: parseInt(item.brandId),
          tagIds: item.tags.map(tag => parseInt(tag)),
          size: item.size
        }))
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'New Consignment' : 'Edit Consignment'}</CardTitle>
          <CardDescription>
            {mode === 'create' 
              ? 'Add new items from an owner for consignment.' 
              : 'Edit existing consignment items.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="owner">Select Owner</Label>
            <Select 
              value={ownerId} 
              onValueChange={setOwnerId} 
              required 
              disabled={isLoading}
            >
              <SelectTrigger id="owner">
                <SelectValue placeholder={isLoading ? "Loading owners..." : "Select an owner"} />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id.toString()}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Another Item
              </Button>
            </div>

            {items.map((item, index) => (
              <Card key={index}>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Item {index + 1}</CardTitle>
                    {items.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-name-${index}`}>Item Name</Label>
                      <Input
                        id={`item-name-${index}`}
                        value={item.name}
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-price-${index}`}>Price ($)</Label>
                      <Input
                        id={`item-price-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, "price", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`item-description-${index}`}>Description</Label>
                    <Textarea
                      id={`item-description-${index}`}
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-color-${index}`}>Color</Label>
                      <Input
                        id={`item-color-${index}`}
                        value={item.color}
                        onChange={(e) => handleItemChange(index, "color", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-brand-${index}`}>Brand</Label>
                      <Select
                        value={item.brandId}
                        onValueChange={(value) => handleItemChange(index, "brandId", value)}
                      >
                        <SelectTrigger id={`item-brand-${index}`}>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id.toString()}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-size-${index}`}>Size</Label>
                      <Input
                        id={`item-size-${index}`}
                        type="text"
                        value={item.size}
                        onChange={(e) => handleItemChange(index, "size", e.target.value)}
                        placeholder="Enter size (e.g. XS, S, M, L, XL, XXL)"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-receive-date-${index}`}>Receive Date</Label>
                      <Input
                        id={`item-receive-date-${index}`}
                        type="date"
                        value={item.receiveDate}
                        onChange={(e) => handleItemChange(index, "receiveDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-tags-${index}`}>Tags</Label>
                    <MultiSelect
                      options={tags.map(tag => ({
                        value: tag.id.toString(),
                        label: tag.name
                      }))}
                      selected={item.tags}
                      onChange={(values) => handleItemChange(index, "tags", values)}
                      placeholder="Select tags"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === 'create' ? 'Create Consignment' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 