import path from 'path'
import { spawn } from 'child-process-promise'
const spawnOptions = { stdio: 'inherit' }

(async () => {
  // Database URL
  const url = 'postgres://birhanu:nuharib83@localhost/toolsio_test'

try {
    // Migrate the DB
    await spawn('./node_modules/.bin/sequelize', ['db:migrate', `--url=${url}`], spawnOptions)
    console.log('*************************')
    console.log('Migration successful')
  } catch (err) {
    // Oh no!
    console.log('*************************')
    console.log('Migration failed. Error:', err.message)
    process.exit(1)
  }
process.exit(0)
})()