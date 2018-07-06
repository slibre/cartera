'use strict'

const util = require('util')
const locale = require('os-locale').sync().replace('_', '-')

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
const numberFormats = {
	percent: new Intl.NumberFormat(
		locale,
		{ style: 'percent' }
	)
}

function getCurrencyFormat (currency) {
	numberFormats[currency] = numberFormats[currency] || new Intl.NumberFormat(
		locale,
		{
			style: 'currency',
			currency,
			maximumFractionDigits: 20
		}
	)
	return numberFormats[currency]
}

class Datetime extends Date {
	[util.inspect.custom] (depth, { stylize }) {
		return stylize(
			this.toLocaleString(),
			'date'
		)
	}
}

class Percent extends Number {
	[util.inspect.custom] (depth, { stylize }) {
		const result = numberFormats.percent.format(this)
		return stylize(
			result,
			'number'
		)
	}
}

class Currency extends Number {
	constructor (amount, currency) {
		super(amount)
		if (!currency) throw new Error('currency must be defined')
		this.currency = currency
	}

	equal (b) {
		return this.toString() === b.toString()
	}

	notEqual (b) {
		return this.toString() !== b.toString()
	}

	add (b) {
		const a = this
		if (this.currency !== b.currency) throw new Error('cannot add two different currencies')
		const result = new Currency(a + b, this.currency)
		console.log('add', util.inspect({ a, b, result }))
		return result
	}

	subtract (b) {
		const a = this
		if (this.currency !== b.currency) throw new Error('cannot subtract two different currencies')
		const result = new Currency(a - b, this.currency)
		console.log('subtract', util.inspect({ a, b, result }))
		return result
	}

	divide (b, currency) {
		const a = this
		const result = new Currency(a / b, currency)
		console.log('divide', util.inspect({ a, b, result }))
		return result
	}

	multiply (b, currency) {
		const a = this
		const result = new Currency(a * b, currency)
		console.log('multiply', util.inspect({ a, b, result }))
		return result
	}

	[util.inspect.custom] (depth, { stylize }) {
		const amount = this
		const currency = this.currency
		const result = getCurrencyFormat(currency).format(amount)
		if (amount.equal(0)) return stylize(result) // ' [ ' + stylize(amount.toString(), 'number') + ' ]'
		return stylize(result, 'number') // ' [ ' + stylize(amount.toString(), 'number') + ' ]'
	}
}

module.exports = { Datetime, Percent, Currency }