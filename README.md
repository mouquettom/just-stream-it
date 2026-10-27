# Just-Stream-It

## Description

JustStreamIt is a web application that displays an interactive,
real-time movie ranking inspired by the concept of JustStreamIt
newsletters.

It provides a responsive interface compatible with the most commonly
used web browsers. Movie data is retrieved from a locally hosted API,
**OCMovies-API**.

------------------------------------------------------------------------

## Prerequisites

-   Python 3 installed on your machine
-   Internet connection

------------------------------------------------------------------------

## Installation and Usage

The website retrieves movie data from the API. To display this data, the
API server must first be running locally.

### 1. Install and Run OCMovies-API Locally

Open a terminal, navigate to the directory of your choice, and clone the
API repository:

``` bash
git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
```

Navigate to the API directory:

``` bash
cd OCMovies-API-EN-FR
```

Create a virtual environment.

#### Windows

``` bash
python -m venv env
env\Scripts\activate
```

#### macOS / Linux

``` bash
python3 -m venv env
source env/bin/activate
```

Install the dependencies:

``` bash
pip install -r requirements.txt
```

Create and populate the database:

``` bash
python manage.py create_db
```

Start the API server:

``` bash
python manage.py runserver
```

The API must be reachable at `http://localhost:8000` (the default
address of `runserver`): this is the address used by the website.

### 2. Clone the JustStreamIt Repository

Open a terminal, navigate to the directory of your choice, and clone the
repository:

``` bash
git clone https://github.com/mouquettom/just-stream-it.git
cd just-stream-it
```

### 3. Run the Application

Navigate to the project directory and open the `index.html` file
directly in your web browser.

------------------------------------------------------------------------

## Project Structure

### `index.html`

The main file that structures the website interface and defines the
different sections, including the best movie and movie categories.

### `styles/style.css`

The stylesheet responsible for the visual presentation, responsive
design, and some animations.

### `scripts/script.js`

The JavaScript file responsible for:

-   API requests using `fetch` to retrieve and display movie data
-   User interactions, including opening the modal, hover effects, and
    carousel navigation

------------------------------------------------------------------------

## Author

Tom Mouquet ([@mouquettom](https://github.com/mouquettom))

Project developed as part of the OpenClassrooms **Développeur
d'application Python** training program.
