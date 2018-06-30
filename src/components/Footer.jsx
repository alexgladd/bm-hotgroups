import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faComments } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import './Footer.css';

export default function Footer(props) {
  return (
    <footer id="Footer">
      <div className="Version">
        <FontAwesomeIcon icon={faTag} /> { process.env.REACT_APP_VERSION }
      </div>

      <div className="Source">
        <a href="https://github.com/alexgladd/bm-hotgroups" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} /> by Alex Gladd
        </a>
      </div>

      <div className="Feedback">
        <a href="https://github.com/alexgladd/bm-hotgroups/issues" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faComments} /> Feedback
        </a>
      </div>
    </footer>
  );
}
