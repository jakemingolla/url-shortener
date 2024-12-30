# `dotenvx` Review

I tried out [`dotenvx`](https://dotenvx.com/) for environment variable
management in this project. Here are my thoughts:

## The `good`

- **Encryption**

  The `dotenvx encrypt` experience worked really well - given plaintext values
  in `.env`, it encodes them using a secret key. This simplifies the management
  of a bunch of different secret values into just a single master key (which
  would be much easier to swap). It also works great in CI settings since the
  `.env` files can be committed to the repository.

## The `bad`

- `dotenvx run`

  This gives a script access to the `.env` decrypted values. It's a bit of a
  pain to make sure _everything_ gets run within the decrypted context -
  otherwise your env vars are just encrypyted garbage. Especially when mixed
  with `docker compose` and database migrations it's a bit hard to keep
  everything in line.

## The `meh`

- **Better Type Support**

  It would be nice if we could make expectations of the `process.env` shape to
  be enforced at runtime rather than still having to rely on outdated
  `string | undefined` everywhere in the code.
