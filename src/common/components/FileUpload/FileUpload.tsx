import { Group, Text, useMantineTheme } from '@mantine/core';
import { IconUpload, IconX, IconFileImport } from '@tabler/icons';
import { Dropzone, DropzoneProps } from '@mantine/dropzone';
import { useState } from 'react';
import { LogData } from '@utils/types';
import { parseFile } from './parseFile';

export default function FileUpload(props: Partial<DropzoneProps>) {
	const theme = useMantineTheme();
	const [load, setLoad] = useState(false);
	const [input, setInput] = useState('');
	const log: LogData = {
		game: '',
		encounters: [],
		static: [],
	};

	function handleFile(file: File[]) {
		setLoad(true);
		file[0].text().then((t) => {
			parseFile(log, t);

			setLoad(false);
		});
	}
	return (
		<>
			<Dropzone
				onDrop={(files) => {
					console.log('accepted files', files);
					handleFile(files);
				}}
				onReject={(files) => console.log('rejected files', files)}
				maxSize={10 * 1024 ** 2}
				maxFiles={1}
				accept={{
					'text/*': ['.log'],
				}}
				loading={load}
				multiple={false}
				{...props}
			>
				<Group
					position="center"
					spacing="xl"
					style={{ minHeight: 220, pointerEvents: 'none' }}
				>
					<Dropzone.Accept>
						<IconUpload
							size={50}
							stroke={1.5}
							color={
								theme.colors[theme.primaryColor][
									theme.colorScheme === 'dark' ? 4 : 6
								]
							}
						/>
					</Dropzone.Accept>
					<Dropzone.Reject>
						<IconX
							size={50}
							stroke={1.5}
							color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
						/>
					</Dropzone.Reject>
					<Dropzone.Idle>
						<IconFileImport size={50} stroke={1.5} />
					</Dropzone.Idle>

					<div>
						<Text size="xl" inline>
							Drag log here or click to select file
						</Text>
						<Text size="sm" color="dimmed" inline mt={7}>
							file should not exceed 10mb
						</Text>
					</div>
				</Group>
			</Dropzone>
			<Text>{input}</Text>
		</>
	);
}
