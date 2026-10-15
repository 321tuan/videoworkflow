import fs from 'node:fs';

const filePath = 'd:\\test AI\\tin-12-csdl\\src\\scenes\\HookScene.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
`          </div>
        </div>
        </div>
      </div>`,
`          </div>
        </div>
      </div>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed extra div in HookScene.tsx');
