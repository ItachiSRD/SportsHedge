<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Nest Commands

```bash
$ nest generate|g [$name or $alias]

# Generate A Nest Element
Schematics available on @nestjs/schematics collection:
    ┌───────────────┬─────────────┬──────────────────────────────────────────────┐
    │ name          │ alias       │ description                                  │
    |---------------|-------------|----------------------------------------------|
    │ application   │ application │ Generate a new application workspace         │
    │ class         │ cl          │ Generate a new class                         │
    │ configuration │ config      │ Generate a CLI configuration file            │
    │ controller    │ co          │ Generate a controller declaration            │
    │ decorator     │ d           │ Generate a custom decorator                  │
    │ filter        │ f           │ Generate a filter declaration                │
    │ gateway       │ ga          │ Generate a gateway declaration               │
    │ guard         │ gu          │ Generate a guard declaration                 │
    │ interceptor   │ itc         │ Generate an interceptor declaration          │
    │ interface     │ itf         │ Generate an interface                        │
    │ library       │ lib         │ Generate a new library within a monorepo     │
    │ middleware    │ mi          │ Generate a middleware declaration            │
    │ module        │ mo          │ Generate a module declaration                │
    │ pipe          │ pi          │ Generate a pipe declaration                  │
    │ provider      │ pr          │ Generate a provider declaration              │
    │ resolver      │ r           │ Generate a GraphQL resolver declaration      │
    │ resource      │ res         │ Generate a new CRUD resource                 │
    │ service       │ s           │ Generate a service declaration               │
    │ sub-app       │ app         │ Generate a new application within a monorepo │
    └───────────────┴─────────────┴──────────────────────────────────────────────┘

Options:
  -d, --dry-run                      Report actions that would be taken without writing out results.
  -p, --project [project]            Project in which to generate files.
  --flat                             Enforce flat structure of generated element.
  --no-flat                          Enforce that directories are generated.
  --spec                             Enforce spec files generation. (default: true)
  --spec-file-suffix [suffix]        Use a custom suffix for spec files.
  --skip-import                      Skip importing (default: false)
  --no-spec                          Disable spec files generation.
  -c, --collection [collectionName]  Schematics collection to use.
  -h, --help                         Output usage information.
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

# Adding a Table

To add a Table, first create the entity in the entities folder for Order or Update Order services.
After that, create the corresponding migration in the migrations folder.
Import the model in the main.js inside the database folder.

# Deposit Bonus

## Create Reward

- amt - 25% of deposit
- type -deposit
- isActive - yes
- redeemable - 0
- redeemed - 0
- redeemActive - true
- redeemStart - now()
- method - trade
- redeemPercent - 0.42

## After Trade

### Get Reward

- userId
- reward isActive
- method - trade
- totalAmount > redeemableAmount

### Update Reward

- redeemable += 0.42 \* Trade_amount (Handle in Code)
- redeemed = redeemable
- Transfer to Main Book

# Referral Bonus

## Create each month

- amt - total referral calculated
- type - referral
- isActive - Yes
- redeemable - 0
- redeemed - 0
- redeemActive - false
- redeemStart - nextMonth
- method - monthly
- percent - 100

## Redeem

After each month, will do it manually for now.
