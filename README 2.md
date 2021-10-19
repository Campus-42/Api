# Campus42 Analytics Api
Welcome to the Campus42 analytics api for logging analytics happening in the Campus42 ecosystem. Here is a simple docs page to introduce you to the api. If you have any questions just email me at [jesper.liedholm@campus42.co.uk](mailto:jesper.liedholm@campus42.co.uk)

## Usage
The api is hosted at http://188.149.249.224:8000 Use this as the base url for all fetch requests.
### Authorization
There can't be an api without some api keys :) Therefore must every fetch request be authorized by an api key. This can be done by including the api as this:
```http://188.149.249.224:8000/?api_key=API_KEY```
### Operations
Currently the api is supporting insertion of analytics data from the client-side only and no data can be queried from the endpoint. These insertions can happen in two methods:
1. **Events** as this ```http://188.149.249.224:8000/analytics/event/?api_key=API_KEY```
2. **Errors** as this ```http://188.149.249.224:8000/analytics/error/?api_key=API_KEY```
### Insertion Data Format
Each insertion must pass on data that should be inserted into the analytics database, this data should include the following fields otherwise it will not be accepted:
| Field | Required | Explanation |
|:---|:---|:---|
| timestamp | yes | A timestamp in milliseonds since UNIX |
| type | yes | What is it that is being measured e.g., "signin" |
| data | yes | The data that is specific for this metric, this must be an object with children |
| platform | yes | Which platform that is being measured e.g., "ios" |
| app_version | no | Which app version it is e.g., "1.23.23" |

### Code  Example
Here are two example of fetch requests, one is POST and the other is GET.

**POST**
```
const fetch = require("node-fetch")

const data = {
	platform: "ios",
	app_version: "1.15.2",
	type: "screen",
	timestamp: Date.now(),
	time_offset: new Date().getTimezoneOffset(),
	data: { to: "Event Focus", from: "Home" },
}

fetch("http://188.149.249.224:8000/analytics/event/?api_key=API_KEY", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log("Successfully posted data with response:", data))
.catch(err => console.error("Could not post data:", err))
```

**GET**
Currently there are no get methods, but these will be added at a later date
```
const  fetch  =  require("node-fetch")

fetch("http://188.149.249.224:8000/analytics/event/?api_key=API_KEY")
.then(response  =>  response.json())
.then(data  =>  console.log("Successfully posted data with response:", data))
.catch(err  =>  console.error("Could not post data:", err))
```

# Author
This api was authored by [Jesper Liedholm (JesLied)](https://github.com/JesLied)
