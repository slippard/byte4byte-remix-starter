# byte4byte-remix-starter.fly.dev

I've seen many small businesses struggle to bend website builders into something that can represent their brand, nearly always falling short. Simply because a website builder can't be **made for your company** when it's **built to work for every company**. Many companies need to upload files, but how they choose to encrypt, store, or backup data traditionally lies with the company they pay huge amounts of money to that claims to secure their data.

This stack offers a solution that should be simple enough to deploy a simple application with potentially advanced features without breaking the bank. The data collected is easily accessed and owned by you. Within the tier parameters, you can get away with only paying about $5/mo for the object storage, and even that is technically optional if you'd rather [rely on fly volume storage](https://fly.io/docs/apps/scale-count/#scale-an-app-with-volumes) which isn't typically recommended unless you're ready to manually back up & restore the database. If you already own your domain, have access to its DNS, and your Fly app incurs under $5 usage, it's written off as a free hobby project. The project grows in cost as the flow of data and users increases within the app, allowing for a much lower entry cost and an easy entry point for various developers to start with and branch off in different directions. It allows the business to invest their money into a design that matches their style and components that enhance their daily workload.

[View Demo](byte4byte-remix-starter.fly.dev)

```sh
email: demo@proton.me
password: demopass
```

## What's in the stack

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Privacy first metrics thanks to [Plausible](https://plausible.io)
- Scalable object storage made easy thanks to [Digital Ocean Spaces](https://www.digitalocean.com/products/spaces)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/utils/sessions#md-createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- Component styling with [DaisyUI](https://daisyui.com/components/)
- Additional Components  with [HeadlessUI](https://headlessui.com)
- Additional Icons From [React Icons](https://react-icons.github.io/react-icons/)
- [HeroIcons](https://heroicons.com/) Additional SVG Library 
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Development

- First run this stack's `remix.init` script and commit the changes it makes to your project.

  ```sh
  npx remix init
  git init # if you haven't already
  git add .
  git commit -m "Initialize project"
  ```

- Initial setup:

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `demo@proton.me`
- Password: `demopass`

### Relevant code:

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)

## Deployment

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly apps create appname
  fly apps create appname-staging
  ```

  > **Note:** Make sure this name matches the `app` set in your `fly.toml` file. Otherwise, you will not be able to deploy.

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app appname
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app appname-staging
  ```

  If you don't have openssl installed, you can also use [1Password](https://1password.com/password-generator) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Add Plausible `PLAUSIBLE_SHARED_LINK` to your fly app secrets:

  ```sh
  fly secrets set PLAUSIBLE_SHARED_LINK=your-shared-link
  ```

  You can view your shared links in your plausible dashboard here: https://plausible.io/example.com/settings/visibility.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app appname
  fly volumes create data --size 1 --app appname-staging
  ```

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

### Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above and if you have, then post as many details about your deployment (including your app name) to [the Fly support community](https://community.fly.io). They're normally pretty responsive over there and hopefully can help resolve any of your deployment issues and questions.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
