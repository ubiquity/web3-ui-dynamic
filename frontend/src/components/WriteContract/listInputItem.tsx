import { sentenceCase } from "change-case";
import { titleCase } from "title-case";
import sha256 from "sha256";
export function listInputItem(
	param: { name: any; internalType: string },
	name: string
) {
	const random=Math.random().toString();
	const hashed=sha256(random);
	const key = `${name}_${param.name}_${param.internalType}_${hashed}`;
	console.log({ key });

	return (
		<li key={key}>
			<input
				onMouseDown={(e) => e.stopPropagation()}
				required
				// onClick={stopBubbling}
				// key={key}
				data-type={param.internalType}
				type={param.internalType.includes(`int`) ? "number" : "text"}
				placeholder={titleCase(sentenceCase(param.name))}
			/>
		</li>
	);
}

// function stopBubbling(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
// 	console.log(`input`);
// 	event.stopPropagation();
// }
