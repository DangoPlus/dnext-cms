import type { Where } from 'payload'

export const publicPostWhere = (...constraints: Where[]): Where => {
  return {
    and: [
      {
        status: {
          equals: 'published',
        },
      },
      {
        or: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            _status: {
              exists: false,
            },
          },
        ],
      },
      ...constraints,
    ],
  }
}
