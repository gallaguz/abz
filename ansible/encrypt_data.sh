#!/bin/bash

ansible-vault encrypt group_vars/all/vault.yml --vault-id .pass
ansible-vault encrypt inventory/hosts --vault-id .pass
