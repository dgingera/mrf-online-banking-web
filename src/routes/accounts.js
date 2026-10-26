'use strict';

const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const debug = require('debug')('mrf:web:accounts');

const router = express.Router();
const core = axios.create({ baseURL: process.env.CORE_BANKING_URL, timeout: 5000 });
const Transfer = z.object({ from: z.string(), to: z.string(), amount: z.number().positive() });

function customer(req) {
  return jwt.verify(req.cookies.session, process.env.SESSION_KEY).sub;
}

router.get('/', async (req, res) => {
  const id = customer(req);
  debug('listing accounts for %s', id);
  const { data } = await core.get(`/customers/${encodeURIComponent(id)}/accounts`);
  res.json(data);
});

router.post('/transfers', async (req, res) => {
  const id = customer(req);
  const transfer = Transfer.parse(req.body);
  debug('transfer %o for %s', transfer, id);
  const { data } = await core.post(`/customers/${encodeURIComponent(id)}/transfers`, transfer);
  res.status(202).json(data);
});

module.exports = router;
