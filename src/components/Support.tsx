import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faMugHot } from "@fortawesome/free-solid-svg-icons";
import ModalDialog from "@/components/ModalDialog";
import Button from "@/components/Button";
import router from "@/router";

function Support() {
  const onOpenChange = (isOpen: boolean) => {
    // poor man's "navigation transition" :p
    if (!isOpen) setTimeout(() => router.navigate({ to: "/" }), 200);
  };

  return (
    <ModalDialog
      defaultOpen
      isDismissable
      title="Support Brandmeister Top Activity"
      onOpenChange={onOpenChange}
    >
      {({ close }) => (
        <div className="flex flex-col flex-nowrap gap-4 text-sm md:text-base lg:text-lg">
          <p>
            Thank you so much for your interest in supporting this project. You can use the button
            below to contribute towards the continued development of{" "}
            <em>Brandmeister Top Activity</em>.
          </p>
          <div className="mt-2 flex justify-center">
            <a
              href="https://buymeacoffee.com/alexgladd"
              target="_blank"
              className="px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-sm text-lg font-bold tracking-wide transition shadow-lg hover:shadow-xl"
            >
              <FontAwesomeIcon icon={faMugHot} /> Buy me a coffee
            </a>
          </div>
          <div className="mt-2 flex justify-end">
            <Button onPress={close}>
              <FontAwesomeIcon icon={faChevronLeft} /> Back
            </Button>
          </div>
        </div>
      )}
    </ModalDialog>
  );
}

export default Support;
