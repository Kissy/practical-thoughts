---
title: "Self-signed SSL certificate"
date: 2019-03-01T00:00:00+02:00
draft: false
---

Creating a self-signed SSL certificate is easy, 
you can found [lots](https://devcenter.heroku.com/articles/ssl-certificate-self) and [lots](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-16-04) of tutorial on internet. 
Creating valid, multiple sub-domains, self-signed SSL certificate is another story.

<!--more-->

# Generate the root certificate

The first required step before having our certificate is to generate the root certificate.
This certificate is used to sign all other generated certificates and
need to be imported into any client keystore.

## Creating the certificate configuration file `root.cer.conf`

{{< highlight ini >}}
[ req ]
default_bits = 4096
default_days = 36500
default_keyfile = root.cer.key
encrypt_key = no
default_md = sha256
prompt = no
utf8 = yes
distinguished_name = root_distinguished_name
x509_extensions = root_extensions

[ root_distinguished_name ]
CN = Root CA
O = Kissy
C = FR

[ root_extensions ]
basicConstraints=CA:TRUE
authorityKeyIdentifier=keyid,issuer
keyUsage = cRLSign, keyCertSign
{{< / highlight >}}

The important configuration parameters is the [distinguished_name](#distinguished-name).

## Generate the certificate with OpenSSL

{{< highlight bash >}}
openssl req -new -x509 -nodes -config root.cer.conf -out root.cer
{{< / highlight >}}

This will generate two files: `root.cer`, the certificate 
and `root.cer.key` the matching private key.

# Generate a Certificate Signing Request (CSR)

In order to create a new certificate, the first step is to create a CSR.
CSR are used to specifies all details of the future certificate to be signed,
including extended key usage (EKU) or other valid sub-domains.

# Create the CSR configuration file `domain.tech.cer.conf`

{{< highlight ini >}}
[ req ]
default_bits = 4096
default_days = 36500
default_keyfile = signed.key
encrypt_key = no
default_md = sha256
prompt = no
utf8 = yes
distinguished_name = domain_tech_distinguished_name
req_extensions = domain_tech_extensions

[ domain_tech_distinguished_name ]
CN = domain.tech

[ domain_tech_extensions ]
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName=@domain_tech_alt_names

[ domain_tech_alt_names ]
DNS.1 = domain.tech
DNS.2 = *.domain.tech
DNS.3 = *.dev.domain.tech
DNS.4 = *.staging.domain.tech
{{< / highlight >}}

The important properties are:

- [distinguished_name](#distinguished-name)
- keyUsage
- extendedKeyUsage
- subjectAltName — The list of all alternate domains & sub-domains

## Generate the CSR with OpenSSL

{{< highlight bash >}}
openssl req -new -nodes -config domain.tech.cer.conf -out domain.tech.csr
{{< / highlight >}}

This will generate the file `domain.tech.csr`.

# Generate a signed certificate

Once the root certificate and the CSR are generated, 
both can be used to sign a new SSL certificates.

## Create certificate extfile `domain.tech.ext`

{{< highlight ini >}}
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName = @domain_tech_alt_names

[domain_tech_alt_names]
DNS.1 = domain.tech
DNS.2 = *.domain.tech
DNS.3 = *.dev.domain.tech
DNS.4 = *.staging.domain.tech
{{< / highlight >}}

The extfile properties should be exactly the same as in the CSR.

## Generate & sign the new certificate using openssl

{{< highlight bash >}}
openssl x509 -req -in domain.tech.csr -CA root.cer -CAkey root.cer.key -CAcreateserial -out domain.tech.cer -extfile domain.tech.ext
{{< / highlight >}}

This will generate the certificate `domain.tech.cer`.

## Optional : Bundle both root & signed certificate together

Some software (like Nginx) requires to have the full certificate chain to operate.

{{< highlight bash >}}
cat domain.tech.cer root.cer > domain.tech.bundle.cer
{{< / highlight >}}

# Appendix

## Distinguished Name

The Distinguished Name (DN) uniquely identifies an entity in an X.509 certificate.
The following attribute types are commonly found in the DN of certificates.

| Distinguished Name Field | Description |
| --------- | --------- |
| CN | Common Name — Unique identifying name |
| DC | Domain component |
| OU | Organizational Unit |
| O  | Organization |
| L  | Locality |
| S  | State |
| C  | Country — two letters ISO code |
