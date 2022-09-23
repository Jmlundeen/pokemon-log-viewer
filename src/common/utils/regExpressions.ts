export const expressions = {
	encounters: /--Wild Pokemon--\r\n([\s\S]*)[\n\r]{6}/ims,
	staticEnc: /--static Pokemon--[\r\n]{2}(.*)[\n\r]{4}--wild /ims,
	setLine:
		/set .([\d]{1,3}).-\s(.*)\s(Grass\/Cave|Fishing|Surfing|Rock Smash)/i,
	getMon: /(.*) (?:lv(\d{1,2})|lvs (\d{1,2}-\d{1,2}))/i,
	game: /randomization of (?:pokemon (.*) \W\w\W.*|(.*) \W\w\W.*|pokemon (.*)) completed/im,
};
