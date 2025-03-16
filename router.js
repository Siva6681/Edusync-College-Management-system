import EmberRouter from '@ember/routing/router';
import config from 'my-college-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('departments');
  this.route('students');
  this.route('teachers');
});
