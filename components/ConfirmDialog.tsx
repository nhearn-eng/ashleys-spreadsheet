"use client";

import * as React from "react";
import { Modal } from "./Modal";
import { Button } from "./ui";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  danger = true,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  const [busy, setBusy] = React.useState(false);
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <p className="text-sm text-ink">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Working…" : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
