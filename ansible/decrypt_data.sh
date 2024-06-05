#!/bin/bash

ansible-vault decrypt group_vars/all/vault.yml --vault-id .pass
ansible-vault decrypt inventory/hosts --vault-id .pass
