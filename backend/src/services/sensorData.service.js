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
 * @param {number} [opts.limit=100] - max records returned
 * @param {number} [opts.rangeMinutes=60] - time window in minutes when from/to omitted
 * @returns {Promise<object[]>}
 */
export async function getHistory({ entityId, from, to, limit = 100, rangeMinutes = 60 }) {
  const where = { entityId }
  const toDate = to || new Date()
  const fromDate = from || new Date(toDate.getTime() - rangeMinutes * 60 * 1000)
  where.timestamp = {
    gte: fromDate,
    lte: toDate,
  }
  const rows = await prisma.sensorReading.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: limit,
  })
  return rows.reverse()
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
