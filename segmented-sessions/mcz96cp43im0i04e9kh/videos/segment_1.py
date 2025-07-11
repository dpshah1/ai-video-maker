from manim import *

class GraphTheoryScene(Scene):
    def construct(self):
        title = Text("Networks, Bridges, and Coloring", font_size=36)
        subtitle = Text("A Visual Dive into Graph Theory", font_size=24)
        
        title.move_to(UP * 1.5)
        subtitle.next_to(title, DOWN)

        self.play(Write(title), Write(subtitle))
        self.wait(1)

        graph = VGroup(
            Circle(radius=0.5).shift(LEFT * 2),
            Circle(radius=0.5).shift(LEFT),
            Circle(radius=0.5).shift(RIGHT),
            Circle(radius=0.5).shift(RIGHT * 2),
            Square(side_length=1).shift(DOWN * 1.5)
        )
        
        self.play(Create(graph))
        self.wait(1)

        bridge_text = Text("Is this a bridge?", font_size=32)
        bridge_text.move_to(DOWN * 1.5)

        self.play(Write(bridge_text))
        self.wait(1.8)

        self.clear()
        self.wait(0.2)