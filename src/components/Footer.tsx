import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faTag } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { version } from "../../package.json";

function Footer() {
  return (
    <footer className="p-2 flex justify-between items-baseline fixed bottom-0 w-screen bg-dark text-accent text-xs md:text-sm">
      <div>
        <FontAwesomeIcon icon={faTag} /> {version}
        <a
          href="https://github.com/alexgladd/bm-hotgroups"
          target="_blank"
          className="ml-2 hover:text-light"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </div>
      <div className="italic">
        73 de <span className="font-mono">K3HEX</span>
      </div>
      <div>
        <a
          href="https://github.com/alexgladd/bm-hotgroups/issues"
          target="_blank"
          className="hover:text-light"
        >
          <FontAwesomeIcon icon={faComments} /> Feedback
        </a>
      </div>
    </footer>
  );
}

export default Footer;
