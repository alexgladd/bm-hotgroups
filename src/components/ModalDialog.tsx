import { Dialog, DialogProps, Heading, Modal, ModalOverlay } from "react-aria-components";

interface ModalDialogProps {
  title?: React.ReactNode;
  children?: DialogProps["children"];
  defaultOpen?: boolean;
  isDismissable?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

function ModalDialog({
  title,
  children,
  defaultOpen,
  isDismissable,
  isOpen,
  onOpenChange,
}: ModalDialogProps) {
  return (
    <ModalOverlay
      defaultOpen={defaultOpen}
      isDismissable={isDismissable}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={({ isEntering, isExiting }) => `
      fixed inset-0 z-[100] overflow-hidden bg-black/25 flex h-screen max-h-screen items-center justify-center p-4 text-center backdrop-blur
      ${isEntering ? "animate-in fade-in duration-300 ease-out" : ""}
      ${isExiting ? "animate-out fade-out duration-200 ease-in" : ""}
    `}
    >
      <Modal
        className={({ isEntering, isExiting }) => `
        w-full max-w-lg lg:max-w-xl xl:max-w-4xl max-h-full overflow-y-auto rounded bg-white p-6 text-left align-middle shadow-xl
        ${isEntering ? "animate-in zoom-in-95 ease-out duration-300" : ""}
        ${isExiting ? "animate-out zoom-out-95 ease-in duration-200" : ""}
      `}
      >
        <Dialog className="outline-none relative">
          {({ close }) => (
            <>
              {title && (
                <Heading
                  slot="title"
                  className="mb-4 text-xl lg:text-2xl font-bold text-primary-700"
                >
                  {title}
                </Heading>
              )}
              {typeof children === "function" ? children({ close }) : children}
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

export default ModalDialog;
