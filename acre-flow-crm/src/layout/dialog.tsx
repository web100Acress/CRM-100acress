import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/utils/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ style, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 50,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      ...style,
    }}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ style, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 50,
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "10px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        ...style,
      }}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          opacity: 0.7,
          transition: "opacity 0.3s ease",
        }}
      >
        <X size={20} />
        <span style={{ display: "none" }}>Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ style, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      rowGap: "8px",
      textAlign: "left",
      marginBottom: "16px",
      ...style,
    }}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ style, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      columnGap: "12px",
      marginTop: "16px",
      ...style,
    }}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ style, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    style={{
      fontSize: "18px",
      fontWeight: 600,
      marginBottom: "8px",
      ...style,
    }}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ style, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    style={{
      fontSize: "14px",
      color: "#666",
      ...style,
    }}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
