# What to cook

## How to run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Design Decisions

### The choice of tools

- Currently I am working mostly with Next.js, but since the exercise required a client-side web application, I decided to use Vite instead of Next. With Next it is possible to create a fully client-side app, but it's a framework meant to provide a wide variety of rendering strategies and for a fully client-side application it would have been an overkill. I am not used to Vite (nor Vitest), but I figured it would be simple enough to learn and use on-the-run.
- For CSS I decided to use CSS modules, which Vite provides by default, but no tailwind. I never had the chance to try it. I think CSS modules are a must and since I started using them I never felt the need to switch to other frameworks.
- I decided to add zod/mini. I am a big fan of run-time checking in JS. This is a rather rough implementation, but I strongly believe in its use, so I wanted to include it in this exercise, to "personalize" it a bit.
- I did not use libraries like SWR or tanstack query. I used them in a couple of occasions, but I am still not very confident in their use. When starting the exercise they seemed overkill, but in retrospective, after I saw how many calls and loaders I needed, they would have probably come in handy.
- I am a big fan of linters. Vite came with eslint, which is nice. Normally I would use also stylelint, commitlint and prettier. I don't actually have strong feeling about most "tab vs spaces" code-style things, I just like to take a decision on one option and write it down. Since I started to lean to this tool I noticed that the quantity of time spent on bike-shedding has been drastically reduced. In this exercise I was working alone, so I decided not to add many rules, Vite defaults were fine to me.

### State Management

- I usually try to avoid state management libraries if I can. I think that the less dependencies you have, the less headaches you have in the long run. I used Redux in the past, when React and Redux seemed to always come together, and I found that many state management libraries tend to become quite pervasive and change a lot how you write your code. Introducing a new one, or removing them is usually not trivial. Also, reducing the amount of npm dependencies is often a good idea.
- I decided to go to the basic react route of adding a bunch of useState. The result was not the greatest, and it could probably be improved by introducing some libraries like TanStack Query, or SWR (since we are client only). If this solution is to be extended, I would strongly evaluate one or the other.
- When I need some basic "state" I usually try to rely on the querystring. I usually try to follow REST best practices, and using paths and querystring as they were intented can usually help to manage some basic state. In this exercise, my first idea was to add the "current step" in the queryparam in some way, maybe adding the selected "area" and "ingredient" as a query parameter, and relying on the presence of those query params to find which step show be shown. In this way I could have removed at least three useState, I think. I did not do this because the introduction of the query params was to be left as an exercise during the live coding session in the exercise text.
- It was requested to store some data in the localstorage. I usually create a useLocalStorage hook as a wrapper on top of the window.localStorage api. This is to place the JSON wrapping and useState in a single place.

### API Strategy

- I called:
  - The list endpoint to present the user with a list of possible values, for both steps
  - The filter endpoint to get the filtered recipes, for both steps
  - The lookup endpoint to get the details of each recipe

- It was not required by the exercise, but I decided to introduce a list of "seenIDs", so the "New Idea" button doesn't show recipes already seen. This is to avoid the case, quite frequent since the DB is kinda small, where there where only a couple of results, and the user would be suggested always the same recipe, without knowning if he saw them all.
- The filter endpoint doesn't seem to correctly accept two queryparams:
  - https://www.themealdb.com/api/json/v1/1/filter.php?a=Canadian has 21 results
  - https://www.themealdb.com/api/json/v1/1/filter.php?i=potatoes has 69 results
  - https://www.themealdb.com/api/json/v1/1/filter.php?a=Canadian&i=potatoes has 69 results

  It seems like they only check one of the query params, and if it is present, they ignore the others. I would expect them to apply all the parameters, but they do not seem to be doing that. To workaround this API limitation I decided to call the filter API twice, once for every step, and then merge the responses in the Result step.

### Dynamic Search

- It was requested to add a Dynamic Search, and I took the first suggestion, to add an autocomplete to the ingredients field. I created a combobox component, and I placed it in a "Autocomplete" folder. I did this because it was a requirement for the exercise, but I would usually go for an external headless component library to do this kind of stuff. The amount of effort to implement and maintain is rarely justifiable, given the quality and accessibility provided nowadays by most open source implementations.
- I added a `useDebounce` hook, which prevents excessive re-renders and related slowdowns while typing.

### Styling

- To keep styling consistent, I used an 8px spacing system and a palette of colors "olive green and grey" taken from the first "palette website" i found. I then created CSS vars to formalize them. In a more evolved setup I would put these CSS variables, together with some of the components in a "design system".
- As I already mentioned, I didn't use tailwind. I am not personally a fan of the approach: in the past I used a bunch of "style systems" made by a set of globally available classes. My experience was that they are quite pervasive and introducing or removing them requires time. They also became deprecated/pointless after CSS improvements, like many grid systems. I prefer to stick to simpler things, provided by technologies like vanilla CSS. Finally, given the size of the exercise, I think that Tailwind would be overkill. A simple set of CSS variables is simpler and I value simplicity a lot.

### Tests

- I was kinda in doubt about whether to write tests or not, since the exercise said both "we really value the quality of testing" and "Testing: one unit test for the selection logic; one component test for the dynamic search" which seems to suggest that tests where to be done during the live coding. I decided to not add any test in this exercise, as it seems to be required to be done during the live coding sessions. I only installed vitest and tried it out a bit before remove everything.
- I usually test things in two ways. First I write Unit (or Component, as you called them) tests besides each file I write, using Jest and React-Testing-Library. Then I identify, together with Product Owners, the "fondamental user journeys" that must work, like login, search and purchase flows. I cover these journey with a small number of "E2E tests" which I usually write in Playwright. I try to write a small number of these tests, since, being "E2E", by their nature, test many things, so more things can break. Maintaining brittle tests is a cost, so I try to have them only in the most important user journeys.

## Final notes

- About "Estensioni": it wasn't clear to me if the "Estensioni (per pairing)" part was to score extra points or to be done together during the live coding. I decided to leave them for the live coding. I just scaffolded a few things (I installed vitest)
- The exercise specifies that "Recommendation comes from the API (not hard-coded)" and I am not really sure what this means. I haven't found any "recommendations" endpoint. So I decided to pick a random recipe from the array.
- I made a mistake and didn't remember that I was supposed to upload this on Github. I didn't start to use Git until late in the development and the commit history was not meaningful anymore. Sorry about this. I'll just write here what I would normally do in a collaborative setup:
  - use conventional commits, to separate important and breaking changes from minor ones.
  - enforcing commit style using commitlint
  - try to make small commits, and quick merges for easier PR review
  - I like to use rebase to maintain a clean history

### About AI use

- Your exercise didn't encourage nor discourage AI use. I am quite on the fence on this topic lately: I personally try to use AI as little as possible, it's a helpful tool to avoid mindless repetitive tasks, but I want to keep my coding skills sharp. In the past, though, I have been also rejected in the early stages of an interview due to my "not eagerness" to use AI as much as possible. I decided to increase my AI usage.
- To implement this exercise I decided to use the same approach I would use in a working condition. I used claude code 4.5, and I tried to use it as much as possible for basic stuff. When I started to lose speed by correcting too much its approach, I started to write things by hand. My aim is to have him writing in a coding style that is indistinguible from what I would write. I value it for the efficency, but I do not want to see a reduction in code quality. I use the same approach I have with stack overflow: look at the code, then rewrite it to fit my coding style.
