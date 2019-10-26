import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import classnames from "classnames";
import Moment from "moment";
import { addFlashMessage } from "../../actions/flashMessageActions";
// Semantic UI JS
import {
  Grid,
  Segment,
  Table,
  Header,
  Select,
  Form,
  Modal,
  Progress,
  Button,
  Icon
} from "semantic-ui-react";
import { graphql, compose } from "react-apollo";
import {
  GET_PROJECTS_QUERY,
  GET_PROJECT_QUERY,
  UPDATE_PROJECT_MUTATION,
  DELETE_PROJECT_MUTATION
} from "../../graphql/projects";

import TasksForm from "./Tasks/Form";

// Localization
import T from "i18n-react";

class Show extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.data.getProject ? this.props.data.getProject.id : null,
      name: this.props.data.getProject ? this.props.data.getProject.name : "",
      deadline: this.props.data.getProject
        ? this.props.data.getProject.deadline
        : "",
      customer: this.props.data.getProject
        ? this.props.data.getProject.customer
        : "",
      status: this.props.data.getProject
        ? this.props.data.getProject.status
        : "",
      description: this.props.data.getProject
        ? this.props.data.getProject.description
        : "",
      progress: this.props.data.getProject
        ? this.props.data.getProject.progress
        : 0,
      tasks: this.props.data.getProject ? this.props.data.getProject.tasks : [],
      user: this.props.data.getProject ? this.props.data.getProject.user : null,
      total: this.props.data.getProject ? this.props.data.getProject.total : 0,
      openConfirmationModal: false
    };
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.data.getProject) {
      this.setState({
        id: nextProps.data.getProject.id,
        name: nextProps.data.getProject.name,
        deadline: nextProps.data.getProject.deadline,
        customer: nextProps.data.getProject.customer,
        status: nextProps.data.getProject.status,
        description: nextProps.data.getProject.description,
        progress: nextProps.data.getProject.progress,
        tasks: nextProps.data.getProject.tasks,
        user: nextProps.data.getProject.user,
        total: nextProps.data.getProject.total
      });
    }
  };

  componentDidMount = () => {
    // Fetch Project when id is present in params
    const { match } = this.props;

    // Check if param id is an int
    const projectId = parseInt(match.params.id, 10);

    if (!projectId) {
      return <Redirect to="/projects" />;
    }
  };

  toggleConfirmationModal = () => {
    this.setState(state => ({
      openConfirmationModal: !state.openConfirmationModal
    }));
  };

  handleStatusChange = value => {
    const { id, name, deadline, description, progress, customer } = this.state;

    this.props
      .updateProjectMutation({
        variables: {
          id,
          name,
          deadline,
          description,
          progress,
          customerId: customer.id,
          status: value
        }
      })
      .then(res => {
        const { success, project, errors } = res.data.updateProject;

        if (success) {
          this.props.addFlashMessage({
            type: "success",
            text: T.translate("projects.form.flash.success_update", {
              name: project.name
            })
          });
        } else {
          let errorsList = {};
          errors.map(error => (errorsList[error.path] = error.message));

          this.setState({ errors: errorsList, isLoading: false });
        }
      })
      .catch(err => this.setState({ errors: err, isLoading: false }));
  };

  handleIncreaseProgress = event => {
    event.preventDefault();

    const {
      id,
      name,
      deadline,
      status,
      description,
      customer,
      progress
    } = this.state;

    if (progress <= 90) {
      // Update Project
      let progressUpdated = progress + 10;

      this.setState({
        progress: progressUpdated
      });

      this.props
        .updateProjectMutation({
          variables: {
            id,
            name,
            deadline,
            status,
            description,
            customerId: customer.id,
            progress: progressUpdated
          }
        })
        .then(res => {
          const { success, project, errors } = res.data.updateProject;

          if (success) {
            this.props.addFlashMessage({
              type: "success",
              text: T.translate("projects.form.flash.success_update", {
                name: project.name
              })
            });
          } else {
            let errorsList = {};
            errors.map(error => (errorsList[error.path] = error.message));

            this.setState({ errors: errorsList, isLoading: false });
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }));
    }
  };

  handleDecreaseProgress = event => {
    event.preventDefault();

    const {
      id,
      name,
      deadline,
      status,
      description,
      customer,
      progress
    } = this.state;

    if (progress >= 10) {
      // Update Project
      let progressUpdated = progress - 10;

      this.setState({
        progress: progressUpdated
      });

      this.props
        .updateProjectMutation({
          variables: {
            id,
            name,
            deadline,
            status,
            description,
            customerId: customer.id,
            progress: progressUpdated
          }
        })
        .then(res => {
          const { success, project, errors } = res.data.updateProject;

          if (success) {
            this.props.addFlashMessage({
              type: "success",
              text: T.translate("projects.form.flash.success_update", {
                name: project.name
              })
            });
          } else {
            let errorsList = {};
            errors.map(error => (errorsList[error.path] = error.message));

            this.setState({ errors: errorsList, isLoading: false });
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }));
    }
  };

  handleDelete(id, event) {
    event.preventDefault();

    const { name } = this.state;

    this.props
      .deleteProjectMutation({
        variables: { id },
        update: (store, { data: { deleteProject } }) => {
          const { success } = deleteProject;

          if (!success) {
            return;
          }
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: GET_PROJECTS_QUERY,
            variables: {
              order: "DESC",
              offset: 0,
              limit: 10
            }
          });
          // Add our comment from the mutation to the end.

          let updatedProjects = data.getProjects.filter(
            project => project.id !== id
          );
          data.getProjects = updatedProjects;

          // Write our data back to the cache.
          store.writeQuery({ query: GET_PROJECTS_QUERY, data });
        }
      })
      .then(res => {
        const { success, errors } = res.data.deleteProject;

        if (success) {
          this.props.addFlashMessage({
            type: "success",
            text: T.translate("projects.show.flash.success_delete", {
              name: name
            })
          });

          this.props.history.push("/projects");
        } else {
          let errorsList = {};
          errors.map(error => (errorsList[error.path] = error.message));

          this.setState({ errors: errorsList, isLoading: false });
        }
      })
      .catch(err => {
        this.props.addFlashMessage({
          type: "error",
          text: T.translate("projects.show.flash.error_delete", { name: name })
        });

        this.setState({ errors: err, isLoading: false });
      });
  }

  render() {
    const {
      id,
      name,
      deadline,
      customer,
      status,
      description,
      progress,
      tasks,
      user,
      openConfirmationModal
    } = this.state;

    return [
      <Grid.Row columns={1} key="segment">
        <Grid.Column width={14}>
          <Segment>
            <Header
              as="h1"
              dividing
              className={classnames({
                blue: status === "new",
                orange: status === "in progress",
                green: status === "finished",
                turquoise: status === "delivered",
                red: status === "delayed"
              })}
            >
              {name}
            </Header>
            <Table basic="very" collapsing celled>
              <tbody>
                <tr>
                  <td>
                    <i>
                      <Header size="tiny">
                        {T.translate("projects.show.customer")}
                      </Header>
                    </i>
                  </td>
                  <td>
                    {customer ? (
                      <Link to={`/customers/show/${customer.id}`}>
                        {customer.name}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <i>
                      <Header size="tiny">
                        {T.translate("projects.show.user")}
                      </Header>
                    </i>
                  </td>
                  <td>{user && user.firstName}</td>
                </tr>
                <tr>
                  <td>
                    <i>
                      <Header size="tiny">
                        {T.translate("projects.show.deadline")}
                      </Header>
                    </i>
                  </td>
                  <td>{Moment(deadline).format("ll")}</td>
                </tr>
                <tr>
                  <td>
                    <i>
                      <Header size="tiny">
                        {T.translate("projects.show.status")}
                      </Header>
                    </i>
                  </td>
                  <td>
                    <Form.Field
                      placeholder={T.translate("projects.form.select_status")}
                      control={Select}
                      name="status"
                      value={status}
                      onChange={(e, { value }) =>
                        this.handleStatusChange(value)
                      }
                      className={classnames("inline field show", {
                        blue: status === "new",
                        orange: status === "in progress",
                        green: status === "finished",
                        turquoise: status === "delivered",
                        red: status === "delayed"
                      })}
                      options={[
                        { key: "default", value: "new", text: "NEW" },
                        {
                          key: "in progress",
                          value: "in progress",
                          text: "IN PROGRESS"
                        },
                        {
                          key: "finished",
                          value: "finished",
                          text: "FINISHED"
                        },
                        { key: "delayed", value: "delayed", text: "DELAYED" },
                        {
                          key: "delivered",
                          value: "delivered",
                          text: "DELIVERED"
                        }
                      ]}
                      selection
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <i>
                      <Header size="tiny">
                        {T.translate("projects.show.progress")}
                      </Header>
                    </i>
                  </td>
                  <td>
                    <div>
                      <Progress
                        progress
                        percent={progress}
                        success
                        className="mb-3"
                      />
                      <Button.Group size="mini">
                        <Button
                          className="ui basic red"
                          onClick={this.handleDecreaseProgress}
                          icon
                        >
                          <Icon name="minus" />
                        </Button>
                        <Button
                          className="ui basic green"
                          onClick={this.handleIncreaseProgress}
                          icon
                        >
                          <Icon name="plus" />
                        </Button>
                      </Button.Group>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i>
                      <Header size="tiny">
                        {T.translate("projects.show.description")}
                      </Header>
                    </i>
                  </td>
                  <td>{description ? description : "-"}</td>
                </tr>
              </tbody>
            </Table>

            <Header as="h4" attached="top" block>
              {T.translate("projects.tasks.header")}
            </Header>
            <Segment attached="bottom" className="p-3">
              {tasks && id && <TasksForm projectId={id} tasks={tasks} />}
            </Segment>

            <div className="pt-3">
              <Button negative onClick={this.toggleConfirmationModal}>
                <Icon className="trash" />
                {T.translate("projects.show.delete")}
              </Button>
              <Link to={`/projects/edit/${id}`} className="ui primary button">
                <Icon className="edit" />
                {T.translate("projects.show.edit")}
              </Link>
            </div>
          </Segment>
        </Grid.Column>
      </Grid.Row>,
      <Modal
        key="modal"
        size="small"
        className="project"
        open={openConfirmationModal}
      >
        <Modal.Header>
          {T.translate("projects.show.confirmation_header")}
        </Modal.Header>
        <Modal.Content>
          <p className="red">{T.translate("projects.show.confirmation_msg")}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.toggleConfirmationModal}>
            {T.translate("projects.show.cancel")}
          </Button>
          <Button negative onClick={this.handleDelete.bind(this, id)}>
            {T.translate("projects.show.delete")}
          </Button>
        </Modal.Actions>
      </Modal>
    ];
  }
}

Show.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
};

const MutationQuery = compose(
  graphql(UPDATE_PROJECT_MUTATION, {
    name: "updateProjectMutation"
  }),
  graphql(DELETE_PROJECT_MUTATION, {
    name: "deleteProjectMutation"
  }),
  graphql(GET_PROJECTS_QUERY, {
    options: () => ({
      variables: {
        order: "DESC",
        offset: 0,
        limit: 10
      }
    })
  }),
  graphql(GET_PROJECT_QUERY, {
    options: props => ({
      variables: {
        id: parseInt(props.match.params.id)
      }
    })
  })
)(Show);

export default connect(
  null,
  { addFlashMessage }
)(MutationQuery);
