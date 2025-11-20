import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function DialogData({
  open,
  onOpenChange,
  titleDialog,
  titleButton,
  dataDialog,
  handleSubmit,
  formData,
  setFormData,
  loading = false,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} size="sm">
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{titleDialog}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {dataDialog.map((item, index) => (
            <div className="space-y-4 pt-2 border-t" key={index}>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {item.title}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {item.fields.map((field, index) => (
                  <div
                    className={`${
                      field.width === "full" ? "col-span-2" : "col-span-1"
                    } ${field.label ? "gap-2" : ""} grid`}
                    key={field.key}
                  >
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.type === "input" && (
                      <Input
                        id={field.key}
                        placeholder={field.placeholder}
                        value={formData[field.key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.key]: e.target.value,
                          })
                        }
                      />
                    )}
                    {field.type === "input-number" && (
                      <Input
                        id={field.key}
                        placeholder={field.placeholder}
                        value={formData[field.key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.key]: Number(e.target.value),
                          })
                        }
                        type="number"
                      />
                    )}
                    {field.type === "select" && (
                      <Select
                        value={formData[field.key] || ""}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            [field.key]: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{field.label}</SelectLabel>
                            {field.options?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                    {field.type === "textarea" && (
                      <Textarea
                        value={formData[field.key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.key]: e.target.value,
                          })
                        }
                        id={field.key}
                        placeholder={field.placeholder}
                      />
                    )}
                    {field.type === "date" && (
                      <Input
                        value={formData[field.key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.key]: e.target.value,
                          })
                        }
                        type="date"
                        id={field.key}
                        placeholder={field.placeholder}
                      />
                    )}
                    {field.type === "month" && (
                      <Input
                        value={formData[field.key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.key]: e.target.value,
                          })
                        }
                        type="month"
                        id={field.key}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            onClick={() => handleSubmit(formData)}
            className="w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : titleButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
