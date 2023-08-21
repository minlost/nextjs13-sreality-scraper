# README: Next.js 13 Study Project for Scraping Data from Sreality Server

## Introduction

This is a study project built with Next.js 13. Its main purpose is to scrape data from the Sreality server. The application has two distinct parts: one for non-logged-in users and one for logged-in users.

## Features

### Non-Logged-In Users:

- Directly view scraping results.
- Save results in a CSV format.
- If the application is running on a local server, save the results to `/git commit -m "first commit"data`.
- **Watchlist**: Users can track price development on their watchlist, allowing for monitoring of price changes.

### Logged-In Users:

- Create user profiles.
- Save data to the database for future access or analysis.

## Technology Stack

- **Framework:** Next.js 13
- **Authentication:** Clerk
- **Database:** MySQL with Planetscale and Prisma
- **Web Scraping:** Puppeteer
- **UI Components:** Custom-made and utilizing Radix UI with the UI library Shadcn.
- **Additional Libraries/Tools:**
  - React Hot Toast
  - React Form
  - Axios
  - Tailwind CSS
  - Zod

## Setup & Installation

1. **Clone the Repository**: git clone [repository_url]

2. **Set Up Environment Variables**:
   Ensure you set up your own environment variables. Check the `.env.example` file in the repository for the necessary variables.

3. **Install Dependencies**:npm install

4. **Scraping Configuration**:
   Set the `SCRAPE_TIMEOUT` environment variable to a minimum of 5000ms (5 seconds) to avoid overloading the servers.

5. **Setup Database**:
   [Instructions on setting up the MySQL database with Planetscale and Prisma.]

6. **Run the Application**: npm run dev

# Important Disclaimer

I do not assume any responsibility for the use of this code. Ensure you comprehend the implications and potential repercussions before deploying or using this application, particularly regarding scraping and data collection from third-party platforms.

## Application Screenshots

![Screenshot 1](https://i.ibb.co/MGPJpkM/1.png)
![Screenshot 2](https://i.ibb.co/sjxhZhy/2.png)
![Screenshot 3](https://i.ibb.co/44kXBRL/3.png)
![Screenshot 4](https://i.ibb.co/pZyzJrN/4.png)

## Contributing

Contributions are warmly welcomed! If you'd like to contribute to this project, please feel free to submit a pull request or open an issue

## License

This project is licensed under the MIT License.
