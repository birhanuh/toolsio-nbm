import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
// Semantic UI Form elements
import { Card, Header, List, Message, Divider } from "semantic-ui-react";
import { Query } from "react-apollo";
import { GET_PROJECT_TASKS_DATA } from "../../graphql/dashboard";

// Localization
import T from "i18n-react";

const ProjectTasksCard = () => (
  <Query query={GET_PROJECT_TASKS_DATA}>
    {({ loading, error, data }) => {
      const countStatus =
        data.getProjectTasksData && data.getProjectTasksData.countStatus;
      const idNameStatus =
        data.getProjectTasksData && data.getProjectTasksData.idNameStatus;

      let newNotification;
      let delayedNotification;

      let newProjects = [];
      let delayedProjects = [];

      countStatus &&
        countStatus.map(item => {
          if (item.status === "new") {
            newNotification = (
              <Message info>
                <Message.Content>
                  {T.translate("dashboard.project_tasks.new_projects", {
                    count: item.count
                  })}
                </Message.Content>
              </Message>
            );
          }

          if (item.status === "delayed") {
            delayedNotification = (
              <Message negative>
                <Message.Content>
                  {T.translate("dashboard.project_tasks.delayed_projects", {
                    count: item.count
                  })}
                </Message.Content>
              </Message>
            );
          }
        });

      idNameStatus &&
        idNameStatus.map(project => {
          if (project.status === "new") {
            newProjects.push(project);
          } else if (project.status === "delayed") {
            delayedProjects.push(project);
          }
        });

      const list = (
        <Card.Content>
          {newNotification}
          <List ordered>
            {newProjects &&
              newProjects.map(project => (
                <List.Item
                  key={project.id}
                  content={
                    <Link
                      to={`/projects/show/${project.id}`}
                      className="item blue"
                    >
                      {project.name}
                    </Link>
                  }
                />
              ))}
          </List>

          <Divider />

          {delayedNotification}
          <List ordered>
            {delayedProjects &&
              delayedProjects.map(project => (
                <List.Item
                  key={project.id}
                  content={
                    <Link
                      to={`/projects/show/${project.id}`}
                      className="item red"
                    >
                      {project.name}
                    </Link>
                  }
                />
              ))}
          </List>
        </Card.Content>
      );

      return (
        <div
          id="projectTask"
          className={classnames("dashboard form", { loading: loading })}
        >
          <Header as="h4">
            {T.translate("dashboard.project_tasks.header")}
          </Header>
          <Card>
            {countStatus && countStatus.length === 0 ? (
              <Card.Content>
                {!!error && (
                  <Message negative>
                    <p>{error.message}</p>
                  </Message>
                )}
                <Message info>
                  <Message.Content>
                    {T.translate("dashboard.project_tasks.no_new_projects")}
                    {T.translate("dashboard.project_tasks.no_delayed_projects")}
                  </Message.Content>
                </Message>
              </Card.Content>
            ) : (
              list
            )}
          </Card>
        </div>
      );
    }}
  </Query>
);

export default ProjectTasksCard;
