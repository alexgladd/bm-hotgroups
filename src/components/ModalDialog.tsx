import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";

interface ModalDialogProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
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
      fixed inset-0 z-[100] overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur
      ${isEntering ? "animate-in fade-in duration-300 ease-out" : ""}
      ${isExiting ? "animate-out fade-out duration-200 ease-in" : ""}
    `}
    >
      <Modal
        className={({ isEntering, isExiting }) => `
        w-full max-w-lg lg:max-w-xl xl:max-w-4xl overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl
        ${isEntering ? "animate-in zoom-in-95 ease-out duration-300" : ""}
        ${isExiting ? "animate-out zoom-out-95 ease-in duration-200" : ""}
      `}
      >
        <Dialog className="outline-none relative">
          {title && (
            <Heading slot="title" className="mb-4 text-xl lg:text-2xl font-bold text-primary-700">
              {title}
            </Heading>
          )}
          {children}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

export default ModalDialog;
