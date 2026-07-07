"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Modal } from "./Modal";
import { Button, Label, Input, Textarea, Select, FieldError } from "./ui";
import { cn, toDateInput } from "@/lib/utils";
import type { ResourceDef, FieldDef } from "@/lib/resources";
import { saveRecord, type ActionResult } from "@/lib/actions";

type RecordShape = Record<string, unknown> & { id?: string };

function defaultsFor(fields: FieldDef[], record: RecordShape | null) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = record?.[f.name];
    if (f.type === "boolean") out[f.name] = Boolean(raw);
    else if (f.type === "date") out[f.name] = toDateInput(raw as string | Date | null);
    else if (f.type === "select")
      out[f.name] = (raw as string) ?? f.options?.[0] ?? "";
    else out[f.name] = (raw as string) ?? "";
  }
  return out;
}

export function ModalForm({
  open,
  onClose,
  resource,
  record,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  resource: ResourceDef;
  record: RecordShape | null;
  onSaved?: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaultsFor(resource.fields, record) });

  React.useEffect(() => {
    if (open) reset(defaultsFor(resource.fields, record));
  }, [open, record, resource.fields, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const result: ActionResult = await saveRecord(
      resource.key,
      record?.id ?? null,
      data
    );
    if (!result.ok) {
      for (const [name, msgs] of Object.entries(result.errors)) {
        if (msgs?.[0]) setError(name as never, { message: msgs[0] });
      }
      return;
    }
    onSaved?.();
    onClose();
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={record ? `Edit ${resource.singular}` : `New ${resource.singular}`}
      description={resource.description}
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {resource.fields.map((f) => {
          const err = (errors as Record<string, { message?: string }>)[f.name]
            ?.message;
          if (f.type === "boolean") {
            return (
              <label
                key={f.name}
                className="flex items-center gap-2.5 rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-navy"
                  {...register(f.name)}
                />
                {f.label}
              </label>
            );
          }
          return (
            <div key={f.name} className={cn(f.full && "sm:col-span-2")}>
              <Label htmlFor={f.name}>
                {f.label}
                {f.required && <span className="text-danger"> *</span>}
              </Label>
              {f.type === "textarea" ? (
                <Textarea id={f.name} placeholder={f.placeholder} {...register(f.name)} />
              ) : f.type === "select" ? (
                <Select id={f.name} {...register(f.name)}>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  id={f.name}
                  type={f.type === "date" ? "date" : f.type === "email" ? "email" : "text"}
                  placeholder={f.placeholder}
                  {...register(f.name)}
                />
              )}
              <FieldError message={err} />
            </div>
          );
        })}

        <div className="sm:col-span-2 mt-2 flex justify-end gap-3 border-t border-line pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
