# <ins>Cinema-Booking-Project</ins>

![Logo](./webapp/public/cc_logo.png)

Software Engineer Project to Create a Cinema-Booking App

<ins>**NOTICE**</ins>

At the moment, this app is in development. Thank you for understanding.

## Table of Contents

* <ins>Use Guide</ins>
    * [Getting Started](#getting-started)
    * [How To Start Up](#start-up)
    * [How To Use The App](#use-app)
    * [How to Close Down the App](#close-app)
    * [Things To Be Aware Of](#aware-of)
    * [Ideas for Further Work](#further-work)
    * [Other Dependencies](#other-dependencies)
    * [Contributors & Acknowledgements](#contrib-acknow)
    * [Contribution Guidelines](#contrib-guidelines)
    * [License](#license)

# <ins>Use Guide</ins>

## <a name="#getting-started">Getting Started</a>

Do a pull request on the dev branch.

Go into the Backend directory and use the following command in the terminal
```
pip install -r requirements.txt
```

Go into the front end directory and run the following command
```
npm install
```

Go into the root directory and use the following command in the terminal
```
npm install supabase --save-dev
```

Have Docker desktop open and run the following in the root directory
```
npx supabase start
```

Make a copy of the .env.example as .env, add the API URL and the access key to the env

To run the FastAPI server run the following command from backend/src
```
uvicorn main:app

or

python -m uvicorn main:app --reload
```

Once that is ran and you open the hosted 172 link provided by the following command
```
npm run dev
```
you can add /docs to the end of the link to see the API docs

## <a name="#start-up">How To Start Up</a>

After following the start up, anytime you want to run the dev environment, 
use the following commands in separate terminals.
```
npx supabase start

python -m uvicorn main:app --reload

npm run dev
```

Then click the 172 host link provided by npm run dev and you can use the page.

## <a name="#use-app">How To Use The App</a>

Its a booking app similar to fandango. Have fun and explore the page.

## <a name="#close-app">How to Close Down the App</a>

In the terminal that run the supabase command to start, run the following:
```
npx supabase stop
```

In the npm run dev and uvicorn terminals, run use ctrl + C (^C) to close them.

## <a name="#aware-of">Things To Be Aware Of</a>

You should make sure to stop the supabase docker container so that you don't waste your computers resources, it takes up a lot.

## <a name="#further-work">Ideas for Further Work</a>

.

## <a name="#other-dependencies">Other Dependencies</a>

We used the supabase local development database:
https://supabase.com/docs/guides/local-development

We used heyapi to generate typescript client for the backend:
https://heyapi.dev/

## <a name="#contrib-acknow">Contributors & Acknowledgements</a>

This app was created by myself (BenWrightSWE).

## <a name="#contrib-guidelines">Contribution Guidelines</a>

Follow the license guideline and please message me regarding any changes you may have made. I'd love to hear about them
and implement them in this version after checking them out.

## <a name="#license">License</a>

For this project I am using the AGPL-3.0 license. Please respect this.

If you want further information regarding the license go to the LICENSE file.


