import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

export default function Pagination({ path, count, offset, limit }) {
  // Prevoius link
  let previousLink;

  if (offset === 0) {
    previousLink = (
      <div className="item disabled">
        <i className="angle left icon" />
      </div>
    );
  } else {
    previousLink = (
      <Link to={`/${path}/${offset - 10}/${limit}`} className="item">
        <i className="angle left icon" />
      </Link>
    );
  }

  // Next link
  let nextLink;

  if (parseInt(count / 10, 10) === offset / 10) {
    nextLink = (
      <div className="item disabled">
        <i className="angle right icon" />
      </div>
    );
  } else {
    nextLink = (
      <Link to={`/${path}/${offset + 10}/${limit}`} className="item">
        <i className="angle right icon" />
      </Link>
    );
  }

  let link1 = parseInt(offset) >= 50 ? parseInt(offset / 10, 10) - 3 : 1;
  let link2 = parseInt(offset) >= 50 ? parseInt(offset / 10, 10) - 2 : 2;
  let link3 = parseInt(offset) >= 50 ? parseInt(offset / 10, 10) - 1 : 3;
  let link4 = parseInt(offset) >= 50 ? parseInt(offset / 10, 10) : 4;
  let link5 = parseInt(offset) >= 50 ? parseInt(offset / 10, 10) + 1 : 5;

  const paginationElement = (
    <div className="ui right floated pagination menu">
      {previousLink}
      {count > 0 && (
        <Link
          to={`/${path}/${parseInt(offset) >= 50 ? offset - 40 : 0}/${limit}`}
          className={classnames("item", { active: link1 === offset / 10 + 1 })}
        >
          {link1}
        </Link>
      )}
      {count > 10 && (
        <Link
          to={`/${path}/${parseInt(offset) >= 50 ? offset - 30 : 10}/${limit}`}
          className={classnames("item", { active: link2 === offset / 10 + 1 })}
        >
          {link2}
        </Link>
      )}
      {count > 20 && (
        <Link
          to={`/${path}/${parseInt(offset) >= 50 ? offset - 20 : 20}/${limit}`}
          className={classnames("item", { active: link3 === offset / 10 + 1 })}
        >
          {link3}
        </Link>
      )}
      {count > 30 && (
        <Link
          to={`/${path}/${parseInt(offset) >= 50 ? offset - 10 : 30}/${limit}`}
          className={classnames("item", { active: link4 === offset / 10 + 1 })}
        >
          {link4}
        </Link>
      )}
      {count > 40 && (
        <Link
          to={`/${path}/${parseInt(offset) >= 50 ? offset : 40}/${limit}`}
          className={classnames("item 4", {
            active: link5 === offset / 10 + 1
          })}
        >
          {link5}
        </Link>
      )}
      {nextLink}
    </div>
  );

  return paginationElement;
}
