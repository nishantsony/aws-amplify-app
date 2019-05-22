import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { API } from 'aws-amplify';
import { Analytics } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  apiName = 'api0d5db60e';
  path = '/items';
  myInit = {
    // OPTIONAL
    headers: {}, // OPTIONAL
    response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    body: {}
  };
  signedIn: boolean;
  user: any;
  greeting: string;
  data = [];
  id = '';
  name = '';

  constructor(private amplifyService: AmplifyService) {
    this.amplifyService.authStateChange$.subscribe(authState => {
      this.signedIn = authState.state === 'signedIn';
      if (!authState.user) {
        this.user = null;
      } else {
        this.user = authState.user;
        this.greeting = 'Hello ' + this.user.username;
        this.getItems();
      }
    });
  }

  getItems() {
    API.get(this.apiName, this.path, this.myInit)
      .then(response => {
        // Add your code here
        this.data = response.data;
        console.log(response);
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  create() {
    Analytics.record({
      name: 'Test Event',
      attributes: {
        username: this.user.username,
        id: this.id,
        name: this.name
      }
    });
    console.log(this.id);
    console.log(this.name);
    this.myInit.body = {
      id: this.id,
      name: this.name
    };
    API.post(this.apiName, this.path, this.myInit)
      .then(response => {
        // Add your code here
        console.log(response);
        this.getItems();
      })
      .catch(error => {
        console.log(error.response);
      });
    this.id = '';
    this.name = '';
  }
}
