had to run
npx netlify login (and occasioanly, npx netlify logout when stale even though i seemed logged in)
then npx netlify link with site id from admin page to link site to folder
then npx netlify env:list to verify secrets
then npx netlify dev was broken
but npx netlify dev --framework=#static worked to build but 404d
then in installed this package and added it to netlify.toml
  package = "@netlify/plugin-gatsby"
  then npx netlify dev worked

  once we added the /emails folder it wasn't picking up the contents with just a run of npx netlify dev
  trying running npx netlify build first and then npx netlify dev
  didnt solve