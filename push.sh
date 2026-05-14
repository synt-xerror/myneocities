#!/bin/bash
rsync -avz --delete ~/work/active/stxerr.dev/ root@10.0.0.1:/srv/website/
ssh root@10.0.0.1 "systemctl reload nginx"
