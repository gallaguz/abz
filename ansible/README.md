
To run all roles:
```shell
ansible-playbook -i inventory all.yml \
    --vault-password-file .pass
```

To build and deploy:
```shell
ansible-playbook -i inventory all.yml \
    --vault-password-file .pass \
    --tags "build,deploy"
```
Encrypt sensitive data:
```shell
 ./encrypt_data.sh 
```

Decrypt sensitive data:
```shell
 ./decrypt_data.sh 
```
