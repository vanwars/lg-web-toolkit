# Local Ground Web Toolkit Documentation
==========
The Local Ground Web Kit is JavaScript library that makes it easy to create apps and interact with Local Ground data.

Dependencies
---------
The toolkit depends on the [Local Ground Data API](https://github.com/LocalGround/localground) and the following JavaScript libraries:

* [Backbone.js](http://backbonejs.org/)
* [Marionette.js](http://marionettejs.com/)
* [Handlebars.js](http://handlebarsjs.com/)
* [Underscore.js](http://underscorejs.org/)

Getting Started
---------
To create your own responsive web app using the Local Ground Data API, read on.

###I. The Database
1. Create an account on Local Ground’s [Test Server](http://dev.localground.org/accounts/register/). Note that this project is still under active development.
2. Create some data.
3. Access browse your data using the Local Ground [Data API](http://dev.localground.org/api/0/).

###II. The Web App
The Local Ground Web Kit is essentially a wrapper that sits on top of Backbone.js / Marionette.js, optimized to interact with the Local Ground Data API. 

####3. Templates
The Local Ground Web Kit uses the ```index.html``` file as the overall template for your web app. Within this harness, you can replace various containers with dynamic HTML content, or modify it to create new containers. In the R4C app, developers opted to replace three sections of the app: 

1. The ```<div id="menu" class="collapse navbar-collapse"></div>``` DIV, which corresponds to the top menu,
2. The  ```<div id="content" class="container"></div>``` DIV, which corresponds to the main content area, and
3. The ```<div class="footer"></div>``` DIV, which corresponds to the footer.

In order to create your own dynamic content for a particular section of the ```index.html``` page, you must first create a new HTML template in the ```templates``` directory at the root of your application. Let’s create one called ```UniversityList.html``` as follows:

```html
<h1>Universities</h1>
<div class="list-group">
	<% _.each(list, function(university) { %>
	<a class="list-group-item" href="#/universities/<%= university.get('id') %>">
		<i class="fa fa-institution fa-fw"></i>&nbsp;
		<%= university.get('university_name') %>
	</a>
	<% }); %>
</div>
```

Note that the list of data that the template loops through is called “list” and that the templating framework used is [Underscore.js](http://underscorejs.org/).

####4. Views
Once you have created your template, you may use one of six Local Ground View classes to render your content, which are described in detail below. Local Ground View classes extend Backbone’s [View](http://backbonejs.org/#View) class. In addition to the standard Backbone functionality, all views handle the following arguments:

* **context**: A list of additional functions and variables that can be accessed by an HTML template.
* **restricted**: A boolean flag indicating whether a user needs to be authenticated in order to access the particular view.

In the R4C example, views are typically instantiated in the ```js/functions.js``` file and accessed when the particular url route is requested.

#####StaticView
Renders static HTML content without any data.

#####ListView
Renders lists of data. In addition to the standard arguments, **ListView** has two additional arguments:

* **collection** ```required```: An instance of a particular collection, say, ```new Universites()```
* **filter**: An optional string that serves as a server-side Local Ground filter. So, for instance, if you wanted to only return universities that were part of the University of California system, our filter would be: ```filter: "where university_type = 'UC'"```.

#####DetailView
Renders a single data record. **DetailView** has one additional argument:

* **model** ```required```: An instance of a particular model, say, ```new University()```

#####DetailUpdateView
Renders a form of updatable data. Same arguments as **DetailView**.

#####HeaderView
Renders a header view. It takes two additional arguments: 

* **anonymousTemplateName** ```required```: The name of the template to display for unauthenticated users.
* **loggedInTemplateName**: The name of the template to display for authenticated users (if applicable).

#####LoginView
Implements all of the functionality needed to authenticate (if you create a users data table). It takes three additional arguments: 

* **collection** ```required```: An instance of your users table in Local Ground. Any table can be a users table, but it must have a column which stores username, and a column that stores the password for every user. For example, ```collection, = new Users()``` (remember that you also have to define the User class in ```js/models.js``` and the Users class in ```js/collections.js```).
* **field_username**: The field name that corresponds to your username column in your Local Ground users table. Defaults to "username”.
* **field_password**: The field name that corresponds to your password column in your Local Ground users table. Defaults to "password”.

####5. Functions
The Local Ground Web Kit is design so that new content is rendered primarily by attaching url paths to corresponding functions. For example, “Every time a user accesses the mysite.com#/universities path, show a list of universities on the page." If you look at the R4C sample [functions page](https://github.com/vanwars/r4c/blob/master/js/functions.js), you can see that each function on the page essentially instantiates one of the six views listed above. So, for example, if you wanted create a function that showed a list of universities, you could create one as follows: 

```javascript
function universityList(){
	var universities = new Universities();
	new ListView({
		el: '#content',
		collection: universities,
		templateName: 'UniversityList'
	});
}
```
This function creates a new Universities collection instance, and passes this instance to a new ListView. In addition, this example assumes that the user has already created a UniversityList.html template in the templates directory. Finally, note that by specifying ```el: '#content'```, you have told the view to insert the rendered content into the element where id="content".

####6. The Configuration File
The purpose of the configuration file ```js/config.js``` is to connect everything together.  Below is a sample configuration file:

```javascript
var config = {
	username: "your_localground_username",
	password: "your_localground_username",
	templateNames: [
		"MySplashPage",
		"UniversityList",
		"UniversityDetail"
	],
	urls: {
		"": welcome,
		"universities": universityList,
		"universities/:id": universityDetail
	},
	loginURL: "login",
	user: null
};
```
* **username** ```required```: Your Local Ground username.
* **password** ```required```: Your Local Ground password.
* **templateNames** ```required```: A list that should have one entry for each HTML template file you created in your templates directory.
* **urls** ```required```: A dictionary of url-function mappings, where the key refers to the URL path, and the value refers to the corresponding function that you defined in ```js/functions.js```.
* **loginURL**: If you are handling authentication, loginURL refers to the path where you ask users to login. Important for Views where the restricted flag is set.
* **user**: If you are handling authentication, this value will be automatically populated by the LoginView when users successfully log in.

Important: Currently the API uses Basic Authentication, so that usernames and passwords are sent in plaintext. We plan to make this more secure in future releases. Please do not store any sensitive information in Local Ground.

Other Notes
---------
You’re welcome to download the R4C repository and try out some of the functionality for yourself. The ultimate goal of this project is to provide novice programmers with some experience working with data as they learn how to make apps. We want to make the JavaScript API even simpler, so suggestions are welcomed. 

Also, please note that because the template loader uses AJAX, the code will only work as a server-hosted website (i.e. url begins with http:// or https://, not file:///). We’d also like your feedback. Please send comments to info [AT] localground [DOT] org

