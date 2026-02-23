import { prisma } from '../db/index.js'

/**
 * Get the latest reading for an entity
 * @param {string} entityId
 * @returns {Promise<object|null>}
 */
export async function getLatestReading(entityId) {
  return prisma.sensorReading.findFirst({
    where: { entityId },
    orderBy: { timestamp: 'desc' },
  })
}

/**
 * Get historical readings for charts
 * @param {object} opts
 * @param {string} opts.entityId
 * @param {Date} [opts.from]
 * @param {Date} [opts.to]
 * @param {number} [opts.limit=100]
 * @returns {Promise<object[]>}
 */
export async function getHistory({ entityId, from, to, limit = 100 }) {
  const where = { entityId }
  if (from || to) {
    where.timestamp = {}
    if (from) where.timestamp.gte = from
    if (to) where.timestamp.lte = to
  }
  return prisma.sensorReading.findMany({
    where,
    orderBy: { timestamp: 'asc' },
    take: limit,
  })
}

/**
 * Store a new sensor reading
 * @param {object} data
 * @param {string} data.entityId
 * @param {number} data.value
 * @param {string} [data.unit='°C']
 * @param {object} [data.rawData]
 * @returns {Promise<object>}
 */
export async function createReading({ entityId, value, unit = '°C', rawData }) {
  return prisma.sensorReading.create({
    data: { entityId, value, unit, rawData: rawData || undefined },
  })
}
