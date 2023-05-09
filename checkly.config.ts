import { defineConfig } from 'checkly'

export default defineConfig({
 projectName: 'Reviewtime',
 logicalId: 'reviewtime',
 repoUrl: 'https://github.com/linusaarnio/reviewtime',
 checks: {
   activated: true,
   muted: false,
   runtimeId: '2023.02',
   frequency: 5,
   locations: ['us-east-1', 'eu-west-1'],
   tags: ['website', 'api'],
   checkMatch: '**/__checks__/**/*.check.ts',
   ignoreDirectoriesMatch: [],
   browserChecks: {
     frequency: 10,
     testMatch: '**/__checks__/**/*.spec.ts',
   },
 },
 cli: {
   runLocation: 'eu-west-1',
 }
})