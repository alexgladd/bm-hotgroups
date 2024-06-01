import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import ModalDialog from "@/components/ModalDialog";
import Button from "@/components/Button";
import router from "@/router";

function About() {
  const onOpenChange = (isOpen: boolean) => {
    // poor man's "navigation transition" :p
    if (!isOpen) setTimeout(() => router.navigate({ to: "/" }), 200);
  };

  return (
    <ModalDialog defaultOpen title="About Brandmeister Top Activity" onOpenChange={onOpenChange}>
      {({ close }) => (
        <div className="flex flex-col flex-nowrap gap-4 text-sm md:text-base lg:text-lg">
          <p>
            I've been a Ham since about 2013. Around 2018 I was looking for something new to explore
            within the hobby and discovered the world of{" "}
            <a
              href="https://en.wikipedia.org/wiki/Digital_mobile_radio"
              target="_blank"
              className="text-primary"
            >
              DMR
            </a>{" "}
            and the{" "}
            <a href="http://brandmeister.network/" target="_blank" className="text-primary">
              Brandmeister
            </a>{" "}
            network.
          </p>
          <p>
            The Brandmeister network provides a fun way to connect with amateur radio enthusiasts
            across the globe without needing to invest in expensive high-frequency (HF) equipment.
            There are lots of different talkgroups on the network ranging from geographic groups to
            a variety of special interests. However, as a new user, it can be hard to figure out
            what talkgroups exist and which are the most active.
          </p>
          <p>
            <span className="italic">Brandmeister Top Activity</span> provides a way to see the most
            active talkgroups and users on the Brandmeister network so you can easily listen to and
            join the conversation! I created this app because I was once a new Brandmeister user
            myself, and found it hard to figure out which talkgroups were active so I could test my
            setup and eventually start chatting. I hope you enjoy using it as much as I do!
          </p>
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

export default About;
