-- 更新 histogram buckets 后，自动删除历史数据，重新开始统计
local metaData = redis.call('hget', KEYS[1], '__meta')
if metaData ~= nil then
    local oldBuckets = cjson.decode(metaData)['buckets']
    table.sort(oldBuckets)
    local oldBucketsStr = table.concat(oldBuckets,'-')

    local inputBuckets = cjson.decode(ARGV[4])['buckets']
    table.sort(inputBuckets)
    local inputBucketsStr = table.concat(inputBuckets,'-')

    if inputBucketsStr ~= oldBucketsStr then
        redis.call('del', KEYS[1])
        redis.call('sRem', KEYS[2], KEYS[1])
    end
end

local increment = redis.call('hIncrByFloat', KEYS[1], ARGV[1], ARGV[3])
redis.call('hIncrBy', KEYS[1], ARGV[2], 1)
if increment == ARGV[3] then
    redis.call('hSet', KEYS[1], '__meta', ARGV[4])
    redis.call('sAdd', KEYS[2], KEYS[1])
end

