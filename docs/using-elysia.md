# `elysia` Review

I've used [`elysia`](https://elysiajs.com/) for this project as opposed to a
'regular' `express` setup for a REST API server. Here are my thoughts:

## The `good`

- **Context Management**

  The runtime injection of singleton objects (in this case, database
  connections) simplified the setup procedure. I would imagine for more
  complicated applications it would also assist greatly in unit test setup.

- **OpenAPI**

  The built-in swagger documentation generation is pretty nifty out of the box.
  I'd imagine styling it might be a bit challenging but as a drop-in plugin it
  works great for internal use.

- **Documentation**

  The website is clear and has great examples of setup (including many
  integrations with third party plugins and tools).

## The `bad`

- **Fighting the Type System**

  The auto-typing of responses and integration with the context works great when
  you're within the scope of `elysia`. However, it's a bit grating when trying
  to integrate types declared outside - everything must be aligned to the
  `t.Object(...)` syntax from with `elysia`. It would be nice if external `type`
  declarations could be used without having to turn them into the `t` system.
