import Markdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import ModalDialog from "@/components/ModalDialog";
import Button from "@/components/Button";
import router from "@/router";
import newsMarkdown from "@/news.md?raw";

function News() {
  const onOpenChange = (isOpen: boolean) => {
    // poor man's "navigation transition" :p
    if (!isOpen) setTimeout(() => router.navigate({ to: "/" }), 200);
  };

  return (
    <ModalDialog
      defaultOpen
      isDismissable
      title="Brandmeister Top Activity News"
      onOpenChange={onOpenChange}
    >
      {({ close }) => (
        <div className="prose prose-sm md:prose-base max-w-none">
          <Markdown>{newsMarkdown}</Markdown>
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

export default News;
