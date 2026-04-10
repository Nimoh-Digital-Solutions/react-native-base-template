.DEFAULT_GOAL := start

install: ## Install dependencies
	yarn install

start: ## Start Expo dev server
	yarn start

ios: ## Run on iOS simulator
	yarn ios

android: ## Run on Android emulator
	yarn android

lint: ## Run ESLint
	yarn lint

type-check: ## Run TypeScript type check
	yarn type-check

test: ## Run Jest tests
	yarn test

prebuild: ## Run Expo prebuild
	yarn prebuild

build-android: ## Build Android (EAS, development:device)
	yarn build:android

build-ios: ## Build iOS (EAS, development:device)
	yarn build:ios
