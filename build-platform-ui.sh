#from https://gitlab.mi-c3.com/snippets/18
#Modified for running in CI
#!/usr/bin/env sh
git clone https://github.com/mi-c3/platform-ui.git \
&& cd platform-ui && yarn && yarn storybook:build \
&& tar czf storybook-static-$(git rev-parse --abbrev-ref HEAD)-$(git rev-parse --short HEAD).tgz -C storybook-static/ . \
&& mv storybook-static*.tgz ../ \
&& cd .. && rm -rf platform-ui